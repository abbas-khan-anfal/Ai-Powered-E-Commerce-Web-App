import { NextResponse } from "next/server";
import { Agent, run, tool } from "@openai/agents";
import z from "zod";
import connectDB from "@/lib/db";
import productModel from "@/models/productModel";
import { auth } from "@/auth";
import aiChatsModel from "@/models/aiChatsModel";

export async function POST(req) {
  const { question, context, chatHistory } = await req.json();
  const sessionUser = await auth();
  const user = sessionUser?.user;

  const productsSuggestionTool = tool({
    name: "search_products",
    description: "Searches for products based on user query",
    parameters: z.object({
      query: z
        .string()
        .describe(
          "The search query for products example : laptops, watches, mobiles etc.",
        ),
    }),
    execute: async ({ query }) => {
      await connectDB();
      const products = await productModel.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });

      let suggestedProducts = "";
      products.forEach((product) => {
        suggestedProducts += `Name: ${product.name}\n`;
        suggestedProducts += `Price: ${product.price}\n`;
        suggestedProducts += `Discount Price: ${product.discountPrice}\n`;
        // image path
        suggestedProducts += `EXACT_IMAGE_URL: ${product?.img_paths?.[0]}\n`;
        suggestedProducts += `EXACT_PRODUCT_URL: http://localhost:3000/shop/product-details/${product.slug}\n`;
        suggestedProducts += `---\n`;
      });
      return suggestedProducts;
    },
  });

  const customerAgent = new Agent({
    name: "Customer Product Overview Assistant",
    instructions: `
      You are an e-commerce AI assistant.

    Answer accurately using only the provided product data. Keep responses concise, clear, and naturally formatted in Markdown. Use headings, bullets, tables, and relevant emojis when helpful.

    For product questions, include when available:
    - Product name
    rating, reviews, features, pros, cons, price, discount price, availability, and key specifications.
    - if any feature is unavailable do not show that feature like if there is 
    not info about pros then don't show pros,
    - Format as a Markdown table when multiple products are discussed.
    - Use beautiful emojis and bolding text where needed for better UI.

    When suggesting products:
    - Use the search_products tool.
    - Never modify, rewrite, normalize, or generate product URLs.
    - Copy EXACT_PRODUCT_URL exactly as provided by the tool.
    - Copy EXACT_IMAGE_URL exactly as provided by the tool.
    - Display the product image using Markdown image syntax:
    - ![Product Image](EXACT_IMAGE_URL)
    - Do not add, remove, or change any character in the URL.
    - Especially do not change hyphens in the slug.
    - Convert the exact URL into a Markdown link like:
    [View Product](EXACT_PRODUCT_URL)

    Use only provided information. If unavailable, say: "I don't know."

    Product Information: ${context}
    Chat History: ${chatHistory}
    `,
    model: "gpt-5-nano-2025-08-07",
    tools: [productsSuggestionTool],
  });

  const aiResponse = await run(customerAgent, question, {
    stream: true,
  });

  try {
    let fullAiResponse = "";
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of aiResponse.toTextStream()) {
          fullAiResponse += chunk;
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        
        // store data in db if user exist
        if (user) {
          await connectDB();
          // save user chat
          await aiChatsModel.create({
            userId: user?.id?.toString(),
            role: "user",
            content: question,
          })

          // save ai chat
          await aiChatsModel.create({
            userId: user?.id?.toString(),
            role: "assistant",
            content: fullAiResponse,
          })
        }

        controller.close();
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error in /api/ai-assistant:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 },
    );
  }
}
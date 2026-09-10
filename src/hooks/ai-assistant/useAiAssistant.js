"use client";

import React from "react";

function useAiAssistant() {
  const askAiAssistantHandler = async (userdata) => {
    const res = await fetch("/api/ai-assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userdata),
    });
    const reader = res.body.getReader();
    return reader;
  };

  return {
    askAiAssistantHandler,
  };
}

export default useAiAssistant;

import Brevo from '@getbrevo/brevo';

// send email function
export const isSendEmail = async (email, otp) => {
    try
    {
        const apiInstance = new Brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_EMAIL_API_KEY);

        const smtpOptions = {
            sender : { email : "vissalkh856@gmail.com", name : "E-shop"},
            to : [{email : email}],
            subject : "OTP Verification Code",
            textContent : `Your 6-digit OTP is : ${otp}`
        }
        
        await apiInstance.sendTransacEmail(smtpOptions);
        console.log("A 6-digit OTP sent to your email ✅");
    }
    catch(error)
    {
        console.log(error);
        console.log("Email cancelled ❌", error.message);
    }
}
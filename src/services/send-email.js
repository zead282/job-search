import nodemailer from 'nodemailer'

const sendemailservices=async({
        to = '', 
        subject = 'no-reply',
        message = '<h1>no-message</h1>',
        attachments = []
})=>{

    const transporter=nodemailer.createTransport({
        host:"localhost",
        service:"gmail",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.EMAIL_PASSWORD
        }
    })

    const send=await transporter.sendMail({
        from:`from ${process.env.EMAIL}`,
        to,
        subject,
        html:message,
        attachments
    })
    return send?.accepted.length ? true : false

}
export default sendemailservices
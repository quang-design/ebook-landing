import { json } from '@sveltejs/kit';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

export async function POST({ request }) {
	const requestBody = await request.json();
	const customerEmail = requestBody.data.object.customer_details.email;
	const customerName = requestBody.data.object.customer_details.name;

	const resend = new Resend(RESEND_API_KEY);

	const PDF_GUIDE_URL = 'https://narrify-public.s3.eu-central-1.amazonaws.com/sample.pdf';

	(async function () {
		const { data, error } = await resend.emails.send({
			from: 'Acme <onboarding@resend.dev>',
			to: [customerEmail],
			subject: 'Your Purchase Confirmation - Complete Spain Relocation Guide',
			html: `
            <h1>Thank You for Your Purchase!</h1>
            <p>Dear ${customerName}, </p>
            <p>We appreciate your purchase of the <strong>Complete Spain Relocation Guide</strong>. We're confident that this ebook will provide you <p><strong>What happens next?</strong></p>
            <ul>
            <li>You will find your ebook attached to this email. Please download and save it for future reference.</li>
            <li>A separate purchase confirmation has been sent to your email as well.</li>
            <li>If you have any questions or need further assistance, don't hesitate to reach out to at support@kizo-agency.com.</li>
            </ul>
            <p>Thank you one again for choosing our guide. We wish you the best of luck on your journey to Spain!</p> 
            <p>Best regards, <br/>The Kizo Agency Team</p>
            `,
			attachments: [
				{
					path: PDF_GUIDE_URL,
					filename: 'Complete Spain Relocation Guide.pdf'
				}
			]
		});

		if (error) {
			return console.error({ error });
		}

		console.log({ data });
	})();

	return json({ response: 'Email sent successfully' });
}

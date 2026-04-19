import emailjs from '@emailjs/browser';

/**
 * Initializes EmailJS with the public key from .env
 */
export const initEmailService = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init({ publicKey });
    console.log('[EmailJS] Initialized successfully.');
  } else {
    console.warn('[EmailJS] WARNING: Public key is missing from .env');
  }
};

/**
 * Builds a clean, readable product string for the email template.
 * @param {Array} items - Cart items
 * @param {Object|null} directProduct - Buy-now product
 */
const buildProductString = (items, directProduct) => {
  if (items && items.length > 0) {
    return items
      .map(
        (item, i) =>
          `[${i + 1}] ${item.name}\n` +
          `    Color: ${item.selectedColor}  |  Size: ${item.selectedSize}\n` +
          `    Qty: ${item.quantity}  |  Price: $${Number(item.price).toFixed(2)}`
      )
      .join('\n\n');
  }

  if (directProduct) {
    const p = directProduct;
    return (
      `[1] ${p.name}\n` +
      `    Color: ${p.selectedColor}  |  Size: ${p.selectedSize}\n` +
      `    Qty: 1  |  Price: $${Number(p.price).toFixed(2)}`
    );
  }

  return 'No products specified.';
};

/**
 * Sends a checkout confirmation email via EmailJS.
 *
 * Template MUST use these exact variable names:
 *   {{name}}  {{email}}  {{phone}}  {{address}}  {{product}}
 *
 * @param {Object} orderData
 * @returns {Promise<boolean>}
 */
export const sendOrderEmail = async (orderData) => {
  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.error('[EmailJS] Missing env variables. Check your .env file.');
    return false;
  }

  // Guard: ensure required fields are present
  if (!orderData.name || !orderData.email || !orderData.phone || !orderData.address) {
    console.error('[EmailJS] orderData is missing required fields:', orderData);
    return false;
  }

  const productString = buildProductString(orderData.items, orderData.directProduct);

  // ✅ These keys MUST match your EmailJS template variables EXACTLY
  const templateParams = {
    order_id: String(orderData.id),
    name:     String(orderData.name).trim(),
    email:    String(orderData.email).trim(),
    phone:    String(orderData.phone).trim(),
    address:  String(orderData.address).trim(),
    product:  productString,
    total:    `₹${Number(orderData.total).toFixed(2)}`,
    reply_to: 'nxtzen.co@gmail.com',
  };

  // Debug log — check browser console when submitting
  console.log('[EmailJS] Sending data:', templateParams);

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, { publicKey });
    console.log('[EmailJS] Response:', response.status, response.text);
    return response.status === 200;
  } catch (error) {
    console.error('[EmailJS] Send failed:', error);
    return false;
  }
};

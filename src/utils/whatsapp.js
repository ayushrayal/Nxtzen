export const generateWhatsAppLink = (orderDetails) => {
  const { name, phone, address, items, total, id } = orderDetails;

  const productList = items
    .map(item => `- ${item.name} (Qty: ${item.quantity})`)
    .join('\n');

  const message = `New Order Received\n\nOrder ID: #${id || Date.now()}\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\nProducts:\n${productList}\n\nTotal: ₹${Number(total).toFixed(2)}\n\nPlease confirm this order.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/917251848020?text=${encodedMessage}`;
};

export const redirectToWhatsApp = (waLink) => {
  try {
    // Attempt standard redirect
    window.location.href = waLink;
  } catch (error) {
    console.warn("Redirect failed, using fallback:", error);
    // Fallback to window.open if window.location.href is restricted/blocked
    window.open(waLink, '_blank', 'noopener,noreferrer');
  }
};

// ============================================================
// IGO CropCare — Professional Email Templates
// Style reference: Blinkit / Zepto / Swiggy Instamart
// ============================================================

export interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    brand?: string
    image_url?: string
    quantity: number
    price: number
  }>
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
  shippingAddress?: {
    name?: string
    line1?: string
    city?: string
    state?: string
    pincode?: string
    phone?: string
  }
  status?: string
  trackingNumber?: string
}

export interface SupportEmailData {
  ticketId: string
  customerName: string
  customerEmail: string
  subject: string
  message: string
  adminReply?: string
  status?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://igo-cropcare.vercel.app'

// ── Shared layout wrapper ────────────────────────────────────
function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>IGO CropCare</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f4;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#15803d 0%,#059669 100%);padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display:inline-flex;align-items:center;gap:10px;">
                      <div style="background:rgba(255,255,255,0.2);border-radius:10px;padding:8px;display:inline-block;">
                        <span style="font-size:22px;">🌱</span>
                      </div>
                      <div style="display:inline-block;vertical-align:middle;margin-left:10px;">
                        <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px;">IGO CropCare</span>
                        <span style="display:block;color:#bbf7d0;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">SEED TO HARVEST</span>
                      </div>
                    </div>
                  </td>
                  <td align="right">
                    <a href="${BASE_URL}" style="color:#bbf7d0;font-size:12px;font-weight:600;text-decoration:none;">Visit Store →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          ${content}

          <!-- Footer -->
          <tr>
            <td style="background:#f8fdf9;border-top:1px solid #e8f5e9;padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Need Help?</p>
                    <p style="margin:0 0 4px;font-size:13px;color:#374151;">📞 +91 74282 08822 &nbsp;|&nbsp; 📧 care@igo-cropcare.in</p>
                    <p style="margin:0;font-size:12px;color:#9ca3af;">Derabassi Industrial Area, Punjab – 140507, India</p>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <a href="${BASE_URL}/products" style="background:#15803d;color:#fff;text-decoration:none;font-size:12px;font-weight:700;padding:8px 16px;border-radius:8px;display:inline-block;">Shop Now</a>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:16px;border-top:1px solid #e5e7eb;margin-top:16px;">
                    <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">
                      © 2026 IGO CropCare Pvt. Ltd. All rights reserved. &nbsp;·&nbsp;
                      <a href="${BASE_URL}/privacy" style="color:#6b7280;">Privacy Policy</a> &nbsp;·&nbsp;
                      <a href="${BASE_URL}/terms" style="color:#6b7280;">Terms</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ── Status badge helper ──────────────────────────────────────
function statusBadge(status: string): string {
  const s = status.toLowerCase()
  let color = '#6b7280'; let bg = '#f3f4f6'
  if (s === 'confirmed') { color = '#0369a1'; bg = '#e0f2fe' }
  if (s === 'packed') { color = '#7c3aed'; bg = '#ede9fe' }
  if (s === 'shipped') { color = '#0891b2'; bg = '#cffafe' }
  if (s === 'delivered') { color = '#15803d'; bg = '#dcfce7' }
  if (s === 'cancelled') { color = '#dc2626'; bg = '#fee2e2' }
  return `<span style="background:${bg};color:${color};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">${status}</span>`
}

// ── Product row helper ───────────────────────────────────────
function productRow(item: OrderEmailData['items'][0]): string {
  const total = (item.price * item.quantity).toFixed(2)
  const imageStyle = `width:56px;height:56px;border-radius:8px;object-fit:cover;border:1px solid #e5e7eb;`
  const placeholderImg = `${BASE_URL}/products/fertilizer_npk.png`
  return `
  <tr style="border-bottom:1px solid #f3f4f6;">
    <td style="padding:14px 0;">
      <table cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="width:70px;vertical-align:top;">
            <img src="${item.image_url || placeholderImg}" alt="${item.name}" style="${imageStyle}" />
          </td>
          <td style="padding-left:12px;vertical-align:top;">
            <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#111827;">${item.name}</p>
            ${item.brand ? `<p style="margin:0 0 6px;font-size:12px;color:#6b7280;">${item.brand}</p>` : ''}
            <p style="margin:0;font-size:12px;color:#6b7280;">Qty: <strong style="color:#374151;">${item.quantity}</strong> × ₹${item.price.toFixed(2)}</p>
          </td>
          <td align="right" style="vertical-align:top;white-space:nowrap;">
            <p style="margin:0;font-size:14px;font-weight:700;color:#15803d;">₹${total}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

// ============================================================
// ORDER CONFIRMATION EMAIL
// ============================================================
export function orderConfirmationEmail(data: OrderEmailData): string {
  const shortId = `IGO-${data.orderId.split('-')[0].toUpperCase()}`
  const addr = data.shippingAddress
  const addrText = addr
    ? [addr.line1, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')
    : 'Not provided'

  const content = `
  <!-- Banner -->
  <tr>
    <td style="background:#f0fdf4;border-bottom:2px solid #bbf7d0;padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">✅</div>
      <h1 style="margin:0 0 6px;font-size:26px;font-weight:900;color:#15803d;">Order Confirmed!</h1>
      <p style="margin:0;font-size:15px;color:#374151;">Hi <strong>${data.customerName}</strong>, your order has been placed successfully.</p>
    </td>
  </tr>

  <!-- Order ID Pill -->
  <tr>
    <td style="padding:20px 32px 8px;">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#f8fdf9;border:1px solid #bbf7d0;border-radius:10px;padding:10px 18px;">
            <span style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Order ID</span>
            <span style="display:block;font-size:20px;font-weight:900;color:#111827;font-family:monospace;">${shortId}</span>
          </td>
          <td style="padding-left:16px;">
            ${statusBadge('Confirmed')}
            <span style="display:block;font-size:11px;color:#9ca3af;margin-top:4px;">Placed ${new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Step tracker (Blinkit-style) -->
  <tr>
    <td style="padding:16px 32px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${['Order Placed','Confirmed','Packed','Shipped','Delivered'].map((step, i) => `
          <td align="center" style="position:relative;">
            <div style="width:28px;height:28px;border-radius:50%;background:${i <= 1 ? '#15803d' : '#e5e7eb'};display:flex;align-items:center;justify-content:center;margin:0 auto 6px;">
              <span style="color:${i <= 1 ? '#fff' : '#9ca3af'};font-size:12px;font-weight:700;">${i <= 1 ? '✓' : (i+1)}</span>
            </div>
            <p style="margin:0;font-size:10px;font-weight:600;color:${i <= 1 ? '#15803d' : '#9ca3af'};text-align:center;">${step}</p>
          </td>
          ${i < 4 ? `<td style="padding-bottom:20px;"><div style="height:2px;background:${i < 1 ? '#15803d' : '#e5e7eb'};margin-top:-8px;"></div></td>` : ''}
          `).join('')}
        </tr>
      </table>
    </td>
  </tr>

  <!-- Products -->
  <tr>
    <td style="padding:0 32px 24px;">
      <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">YOUR ITEMS</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;padding:0 16px;">
        <tr><td style="padding:0 16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${data.items.map(productRow).join('')}
          </table>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Price breakdown -->
  <tr>
    <td style="padding:0 32px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
        <tr><td style="padding:8px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:13px;color:#6b7280;padding:4px 0;">Subtotal</td>
              <td align="right" style="font-size:13px;color:#374151;padding:4px 0;">₹${data.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#6b7280;padding:4px 0;">Shipping</td>
              <td align="right" style="font-size:13px;color:${data.shipping === 0 ? '#15803d' : '#374151'};font-weight:${data.shipping === 0 ? '700' : '400'};padding:4px 0;">${data.shipping === 0 ? 'FREE' : `₹${data.shipping}`}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#6b7280;padding:4px 0;">GST (5%)</td>
              <td align="right" style="font-size:13px;color:#374151;padding:4px 0;">₹${data.tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px 0 0;border-top:1px solid #e5e7eb;"></td>
            </tr>
            <tr>
              <td style="font-size:16px;font-weight:800;color:#111827;padding:4px 0;">Total</td>
              <td align="right" style="font-size:18px;font-weight:900;color:#15803d;padding:4px 0;">₹${data.total.toFixed(2)}</td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Address + Payment -->
  <tr>
    <td style="padding:0 32px 28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:48%;vertical-align:top;padding-right:8px;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">DELIVERY ADDRESS</p>
            <div style="background:#f8fdf9;border:1px solid #bbf7d0;border-radius:10px;padding:14px;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#111827;">📍 ${addr?.name || data.customerName}</p>
              <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">${addrText}</p>
              ${addr?.phone ? `<p style="margin:4px 0 0;font-size:12px;color:#6b7280;">📞 ${addr.phone}</p>` : ''}
            </div>
          </td>
          <td style="width:4%;"></td>
          <td style="width:48%;vertical-align:top;padding-left:8px;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">PAYMENT METHOD</p>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#111827;">💳 ${data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
              <p style="margin:0;font-size:12px;color:#6b7280;">Estimated delivery: 3–5 business days</p>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 32px 32px;text-align:center;">
      <a href="${BASE_URL}/profile/orders" style="background:#15803d;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:12px;display:inline-block;letter-spacing:0.3px;">Track Your Order →</a>
      <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">or WhatsApp us at <a href="https://wa.me/917428208822" style="color:#15803d;font-weight:700;">+91 74282 08822</a></p>
    </td>
  </tr>
  `
  return emailWrapper(content)
}

// ============================================================
// ORDER STATUS UPDATE EMAIL
// ============================================================
export function orderStatusUpdateEmail(data: OrderEmailData): string {
  const shortId = `IGO-${data.orderId.split('-')[0].toUpperCase()}`
  const status = data.status || 'updated'

  const statusMessages: Record<string, { emoji: string; headline: string; subtext: string; bg: string }> = {
    confirmed: { emoji: '✅', headline: 'Order Confirmed', subtext: 'Your order is confirmed and will be packed soon.', bg: '#f0fdf4' },
    packed:    { emoji: '📦', headline: 'Order Packed', subtext: 'Your order is packed and ready to be picked up by our courier.', bg: '#faf5ff' },
    shipped:   { emoji: '🚚', headline: 'Order Shipped!', subtext: 'Your order is on the way. Expected delivery in 2–4 days.', bg: '#eff6ff' },
    delivered: { emoji: '🎉', headline: 'Order Delivered!', subtext: 'Your order has been delivered. We hope you love our products!', bg: '#f0fdf4' },
    cancelled: { emoji: '❌', headline: 'Order Cancelled', subtext: 'Your order has been cancelled. Refund will be processed if applicable.', bg: '#fef2f2' },
    rejected:  { emoji: '⛔', headline: 'Order Rejected', subtext: 'We were unable to process your order. Please contact support.', bg: '#fef2f2' },
  }

  const msg = statusMessages[status.toLowerCase()] || { emoji: '📋', headline: `Order ${status}`, subtext: 'Your order status has been updated.', bg: '#f9fafb' }

  const content = `
  <!-- Banner -->
  <tr>
    <td style="background:${msg.bg};border-bottom:2px solid #e5e7eb;padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">${msg.emoji}</div>
      <h1 style="margin:0 0 6px;font-size:24px;font-weight:900;color:#111827;">${msg.headline}</h1>
      <p style="margin:0;font-size:14px;color:#6b7280;">Hi <strong>${data.customerName}</strong> — ${msg.subtext}</p>
    </td>
  </tr>

  <!-- Order reference -->
  <tr>
    <td style="padding:24px 32px 16px;">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#f8fdf9;border:1px solid #bbf7d0;border-radius:10px;padding:10px 18px;">
            <span style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Order ID</span>
            <span style="display:block;font-size:20px;font-weight:900;color:#111827;font-family:monospace;">${shortId}</span>
          </td>
          <td style="padding-left:16px;">
            ${statusBadge(status)}
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Step tracker -->
  <tr>
    <td style="padding:8px 32px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${['Placed','Confirmed','Packed','Shipped','Delivered'].map((step, i) => {
            const statusOrder = ['pending','confirmed','packed','shipped','delivered']
            const currentIdx = statusOrder.indexOf(status.toLowerCase())
            const filled = i <= currentIdx
            return `
            <td align="center">
              <div style="width:28px;height:28px;border-radius:50%;background:${filled ? '#15803d' : '#e5e7eb'};margin:0 auto 6px;line-height:28px;text-align:center;">
                <span style="color:${filled ? '#fff' : '#9ca3af'};font-size:11px;font-weight:700;">${filled ? '✓' : (i+1)}</span>
              </div>
              <p style="margin:0;font-size:10px;font-weight:600;color:${filled ? '#15803d' : '#9ca3af'};text-align:center;">${step}</p>
            </td>
            ${i < 4 ? `<td style="padding-bottom:20px;"><div style="height:2px;background:${filled && i < currentIdx ? '#15803d' : '#e5e7eb'};margin-top:-8px;"></div></td>` : ''}
            `
          }).join('')}
        </tr>
      </table>
    </td>
  </tr>

  ${data.trackingNumber ? `
  <!-- Tracking -->
  <tr>
    <td style="padding:0 32px 24px;">
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px 20px;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;">🚚 Tracking Number</p>
        <p style="margin:0;font-size:16px;font-weight:800;color:#111827;font-family:monospace;">${data.trackingNumber}</p>
      </div>
    </td>
  </tr>
  ` : ''}

  <!-- Items summary -->
  <tr>
    <td style="padding:0 32px 24px;">
      <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">ORDER ITEMS</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;">
        <tr><td style="padding:4px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${data.items.map(productRow).join('')}
          </table>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 32px 32px;text-align:center;">
      <a href="${BASE_URL}/profile/orders" style="background:#15803d;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 28px;border-radius:12px;display:inline-block;">View Order Details →</a>
      <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">Questions? <a href="https://wa.me/917428208822" style="color:#15803d;font-weight:700;">Chat on WhatsApp</a> or <a href="${BASE_URL}/profile/inbox" style="color:#15803d;font-weight:700;">Open Support</a></p>
    </td>
  </tr>
  `
  return emailWrapper(content)
}

// ============================================================
// SUPPORT REPLY EMAIL (Admin → Customer)
// ============================================================
export function supportReplyEmail(data: SupportEmailData): string {
  const content = `
  <!-- Banner -->
  <tr>
    <td style="background:#eff6ff;border-bottom:2px solid #bfdbfe;padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">💬</div>
      <h1 style="margin:0 0 6px;font-size:24px;font-weight:900;color:#1e40af;">Response to Your Query</h1>
      <p style="margin:0;font-size:14px;color:#6b7280;">Hi <strong>${data.customerName}</strong>, our team has responded to your support request.</p>
    </td>
  </tr>

  <!-- Ticket info -->
  <tr>
    <td style="padding:24px 32px 16px;">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:10px 18px;">
            <span style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Ticket ID</span>
            <span style="display:block;font-size:18px;font-weight:900;color:#111827;font-family:monospace;">#${data.ticketId.slice(0,8).toUpperCase()}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Your query -->
  <tr>
    <td style="padding:0 32px 16px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">YOUR QUERY</p>
      <div style="background:#f9fafb;border-left:3px solid #d1d5db;border-radius:0 8px 8px 0;padding:14px 16px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#374151;">${data.subject}</p>
        <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">${data.message}</p>
      </div>
    </td>
  </tr>

  <!-- Admin reply -->
  <tr>
    <td style="padding:0 32px 24px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:1px;">🌱 IGO CropCare Support Team</p>
      <div style="background:#f0fdf4;border-left:3px solid #15803d;border-radius:0 8px 8px 0;padding:16px 18px;">
        <p style="margin:0;font-size:14px;color:#111827;line-height:1.7;">${data.adminReply || 'Our team has updated your support ticket.'}</p>
      </div>
    </td>
  </tr>

  <!-- CTA -->
  <tr>
    <td style="padding:0 32px 32px;text-align:center;">
      <a href="${BASE_URL}/profile/inbox" style="background:#15803d;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 28px;border-radius:12px;display:inline-block;">View Full Conversation →</a>
      <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">Still need help? Reply to this email or WhatsApp <a href="https://wa.me/917428208822" style="color:#15803d;">+91 74282 08822</a></p>
    </td>
  </tr>
  `
  return emailWrapper(content)
}

// ============================================================
// SUPPORT TICKET CREATED (Customer copy)
// ============================================================
export function supportTicketCreatedEmail(data: SupportEmailData): string {
  const content = `
  <!-- Banner -->
  <tr>
    <td style="background:#f0fdf4;border-bottom:2px solid #bbf7d0;padding:32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">🎫</div>
      <h1 style="margin:0 0 6px;font-size:24px;font-weight:900;color:#15803d;">Support Ticket Created</h1>
      <p style="margin:0;font-size:14px;color:#374151;">Hi <strong>${data.customerName}</strong>, we've received your query and will respond within 24 hours.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:24px 32px 16px;">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#f8fdf9;border:1px solid #bbf7d0;border-radius:10px;padding:10px 18px;">
            <span style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Ticket ID</span>
            <span style="display:block;font-size:18px;font-weight:900;color:#111827;font-family:monospace;">#${data.ticketId.slice(0,8).toUpperCase()}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 24px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">YOUR MESSAGE</p>
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:16px 20px;">
        <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#111827;">${data.subject}</p>
        <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">${data.message}</p>
      </div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 32px 32px;text-align:center;">
      <a href="${BASE_URL}/profile/inbox" style="background:#15803d;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 28px;border-radius:12px;display:inline-block;">Track Your Ticket →</a>
    </td>
  </tr>
  `
  return emailWrapper(content)
}

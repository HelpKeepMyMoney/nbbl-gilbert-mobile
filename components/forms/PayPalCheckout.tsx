"use client";

type PayPalCheckoutProps = {
  paymentUrl: string;
  label: string;
  amountLabel: string;
  warning?: string;
};

export default function PayPalCheckout({
  paymentUrl,
  label,
  amountLabel,
  warning,
}: PayPalCheckoutProps) {
  return (
    <div className="paypal-checkout">
      {warning ? <p className="form-note form-note-warning">{warning}</p> : null}
      <a className="btn primary" href={paymentUrl}>
        Pay {amountLabel} with PayPal →
      </a>
      <p className="form-note">
        You will complete <strong>{label}</strong> on PayPal. After payment,
        PayPal will email a receipt and return you to this site.
      </p>
    </div>
  );
}

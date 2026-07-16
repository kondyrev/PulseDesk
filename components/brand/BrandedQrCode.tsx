"use client";

type BrandedQrCodeProps = {
  qrImageUrl: string;
  alt: string;
  className?: string;
};

const LOGO_SUBSTRATE_PERCENT = 20;
const LOGO_PERCENT = 15;

export default function BrandedQrCode({
  qrImageUrl,
  alt,
  className,
}: BrandedQrCodeProps) {
  const logoSizeInsideSubstrate =
    (LOGO_PERCENT / LOGO_SUBSTRATE_PERCENT) * 100;

  return (
    <div className={["relative inline-block leading-none", className].filter(Boolean).join(" ")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrImageUrl}
        alt={alt}
        className="block h-full w-full rounded-[inherit] object-contain"
      />

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[22%] bg-white"
        style={{
          height: `${LOGO_SUBSTRATE_PERCENT}%`,
          width: `${LOGO_SUBSTRATE_PERCENT}%`,
        }}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/pulse-logo.svg"
          alt=""
          className="object-contain"
          style={{
            height: `${logoSizeInsideSubstrate}%`,
            width: `${logoSizeInsideSubstrate}%`,
          }}
        />
      </div>
    </div>
  );
}

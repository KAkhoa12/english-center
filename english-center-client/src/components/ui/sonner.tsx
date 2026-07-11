import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="bottom-right"
      closeButton
      richColors
      expand
      visibleToasts={5}
      duration={4000}
      icons={{
        success: (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint/15">
            <CircleCheckIcon className="h-4 w-4 text-mint-deep" strokeWidth={2.5} />
          </span>
        ),
        info: (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky/15">
            <InfoIcon className="h-4 w-4 text-sky-deep" strokeWidth={2.5} />
          </span>
        ),
        warning: (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5A623]/15">
            <TriangleAlertIcon className="h-4 w-4 text-[#D97706]" strokeWidth={2.5} />
          </span>
        ),
        error: (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral/15">
            <OctagonXIcon className="h-4 w-4 text-coral" strokeWidth={2.5} />
          </span>
        ),
        loading: (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint/15">
            <Loader2Icon className="h-4 w-4 animate-spin text-mint-deep" strokeWidth={2.5} />
          </span>
        ),
      }}
      style={
        {
          "--normal-bg": "#FFFFFF",
          "--normal-text": "#1C1C1E",
          "--normal-border": "#EDEDED",
          "--success-bg": "#FFFFFF",
          "--success-text": "#1C1C1E",
          "--success-border": "rgba(0, 212, 164, 0.25)",
          "--error-bg": "#FFFFFF",
          "--error-text": "#1C1C1E",
          "--error-border": "rgba(245, 90, 60, 0.25)",
          "--info-bg": "#FFFFFF",
          "--info-text": "#1C1C1E",
          "--info-border": "rgba(135, 168, 200, 0.3)",
          "--warning-bg": "#FFFFFF",
          "--warning-text": "#1C1C1E",
          "--warning-border": "rgba(245, 166, 35, 0.25)",
          "--border-radius": "16px",
        } as React.CSSProperties
      }
      toastOptions={{
        closeButton: true,
        classNames: {
          toast:
            "cn-toast font-sans text-[13px] text-body border border-line-soft shadow-[0_16px_40px_-12px_rgba(0,0,0,0.12)] !rounded-2xl !px-4 !py-3.5",
          title: "text-[14px] font-semibold text-ink tracking-tight",
          description: "text-[13px] text-muted mt-0.5 leading-relaxed",
          actionButton:
            "!bg-ink !text-white !text-[12px] !font-semibold !rounded-full !px-4 !py-1.5 !h-auto hover:!bg-mint-deep transition-colors",
          cancelButton:
            "!bg-surface-soft !text-muted !text-[12px] !font-medium !rounded-full !px-4 !py-1.5 !h-auto !border !border-line hover:!bg-line-soft transition-colors",
          closeButton:
            "!bg-surface-soft !border !border-line-soft !text-muted hover:!bg-line-soft hover:!text-ink !rounded-full !h-7 !w-7 !p-0 transition-all",
          success:
            "!border-l-[3px] !border-l-mint !border-t-line-soft !border-r-line-soft !border-b-line-soft",
          error:
            "!border-l-[3px] !border-l-coral !border-t-line-soft !border-r-line-soft !border-b-line-soft",
          info: "!border-l-[3px] !border-l-sky !border-t-line-soft !border-r-line-soft !border-b-line-soft",
          warning:
            "!border-l-[3px] !border-l-[#F5A623] !border-t-line-soft !border-r-line-soft !border-b-line-soft",
          loading:
            "!border-l-[3px] !border-l-mint !border-t-line-soft !border-r-line-soft !border-b-line-soft",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

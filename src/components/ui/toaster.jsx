import { useToast } from "@/components/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    (<ToastProvider >
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          (<Toast
           key={id} {...props} className=" shadow-sm shadow-slate-50"
          //  style={{
          //   width:"350px",
          //   position: 'fixed',
          //   bottom: '8px', // Adjust the bottom spacing
          //   right: '4px', // Adjust the right spacing
          //   zIndex: 9999, // Ensure it stays on top of other content
          // }}
           >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>)
        );
      })}
      <ToastViewport />
    </ToastProvider>)
  );
}

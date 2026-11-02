import { createRoot } from "react-dom/client";
  import React from "react";
  import { BrowserRouter } from "react-router";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; errorMsg?: string }
  > {
    state = { hasError: false, errorMsg: "" };
    static getDerivedStateFromError(error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      return { hasError: true, errorMsg: msg };
    }
    componentDidCatch(error: unknown, info: React.ErrorInfo) {
      console.error("[App] render error:", error, info);
    }
    render() {
      if (this.state.hasError) {
        return (
          <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
            <h1 className="text-xl font-extrabold text-foreground">
              Có lỗi xảy ra khi hiển thị trang
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Vui lòng thử làm mới trang hoặc quay lại danh sách phòng.
            </p>
            {this.state.errorMsg && (
              <p className="text-xs text-muted-foreground/70 font-mono bg-muted px-3 py-1.5 rounded-lg max-w-lg truncate">
                {this.state.errorMsg}
              </p>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, errorMsg: "" });
                  window.location.reload();
                }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Tải lại trang
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, errorMsg: "" });
                  window.location.href = "/rooms";
                }}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Danh sách phòng
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, errorMsg: "" });
                  window.location.href = "/";
                }}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white hover:brightness-95"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        );
      }
      return this.props.children;
    }
  }

  // ── Chặn pull-to-refresh / tự reload trên mobile ──────
  // iOS Safari bỏ qua overscroll-behavior, nên phải chặn bằng JS:
  // chỉ chặn khi đang ở đầu trang VÀ kéo xuống (không ảnh hưởng cuộn bình thường)
  let ptrStartY = 0;
  window.addEventListener(
    "touchstart",
    (e) => {
      ptrStartY = e.touches[0].clientY;
    },
    { passive: true },
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      const dy = e.touches[0].clientY - ptrStartY;
      if (window.scrollY <= 0 && dy > 0) e.preventDefault();
    },
    { passive: false },
  );

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  );
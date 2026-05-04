"use client";

import { useState, useCallback, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

export default function PinInput() {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = useCallback(async (formData: FormData) => {
    setError("");
    const code = formData.get("code") as string;
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result.success) {
      window.location.href = "/admin/dashboard";
    } else {
      setError(result.message || "Código incorrecto");
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^[0-9]$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    const code = newDigits.join("");
    if (code.length === 4) {
      setTimeout(() => {
        document.querySelector('form')?.requestSubmit();
      }, 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted) {
      const newDigits = [...digits];
      for (let i = 0; i < 4; i++) {
        newDigits[i] = pasted[i] || "";
      }
      setDigits(newDigits);
      const focusIndex = Math.min(pasted.length, 3);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="w-full max-w-[24rem]">
      <Card className="border-0 shadow-[0_12px_40px_rgb(0,54,51,0.1)]">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#003633]/15 to-[#134e4a]/10">
            <KeyRound className="h-10 w-10 text-[#003633]" />
          </div>
          <CardTitle className="text-[32px] font-bold text-[#003633] tracking-tight">Roomies</CardTitle>
          <CardDescription className="text-[16px] mt-2">Ingresa tu código de acceso</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="flex flex-col items-center gap-6">
            <div className="flex gap-3">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-16 h-16 text-center text-[28px] font-bold border-2 rounded-2xl border-[#bfc8c6] focus:border-[#003633] focus:ring-4 focus:ring-[#003633]/10 outline-none transition-all"
                />
              ))}
            </div>
            <input type="hidden" name="code" value={digits.join("")} />
            <SubmitButton />
            {error && <p className="text-[14px] text-[#ba1a1a]">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-[52px] text-[16px] bg-[#003633] hover:bg-[#003633]/90 rounded-2xl font-semibold"
    >
      {pending ? "Verificando..." : "Ingresar"}
    </Button>
  );
}

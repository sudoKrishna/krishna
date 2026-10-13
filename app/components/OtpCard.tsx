"use client";

import { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp";

export function OtpCard() {
  const [value, setValue] = useState("");
  const complete = value.length === 6;

  return (
    <div className="flex justify-center px-6 pb-24">
      <div className="w-full max-w-[480px] rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
        <p className="text-sm font-medium text-neutral-800">Verify it&apos;s you</p>
        <p className="mt-1 text-[13px] text-neutral-500">
          Enter the 6-digit code we sent to your email.
        </p>

        <div className="mt-6 flex justify-center">
          <InputOTP maxLength={6} value={value} onChange={setValue} success={complete}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p className="mt-4 text-center text-[12px] text-neutral-400">
          {complete ? "Code complete ✓" : "Paste or type the code"}
        </p>
      </div>
    </div>
  );
}

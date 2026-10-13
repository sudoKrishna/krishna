"use client";

import { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp";

export function VerifyContent() {
  const [value, setValue] = useState("");
  const complete = value.length === 6;

  return (
    <div className="flex w-full flex-col items-center text-center">
      <p className="text-[18px] font-medium text-[#1a1a1a]">Verify it&apos;s you</p>
      <p className="mt-1.5 max-w-[280px] text-[13px] text-[#5a5a5a]">
        Enter the 6-digit code we sent to your email.
      </p>

      <div className="mt-6 origin-center scale-90">
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

      <p className="mt-5 text-[12px] text-[#8a8a8a]">
        {complete ? "Code complete ✓" : "Paste or type the code"}
      </p>
    </div>
  );
}

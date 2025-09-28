"use client";

import { useMemo } from "react";
import { InMemoryStringStorage } from "../fhevm/GenericStringStorage";

export const useInMemoryStorage = () => {
  return useMemo(() => new InMemoryStringStorage(), []);
};
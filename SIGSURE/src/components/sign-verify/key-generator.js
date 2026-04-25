"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { KeyRound, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const generateMockKeyPair = () => {
  const keyId = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const timestamp = Date.now();

  const publicKey = `PUB_${keyId}_${timestamp}`;
  const privateKey = `PRIV_${keyId}_${timestamp}`;

  return { publicKey, privateKey };
};

export default function KeyGenerator({
  publicKey,
  setPublicKey,
  privateKey,
  setPrivateKey,
}) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGenerateKeys = () => {
    if (typeof window !== "undefined" && window.crypto) {
      const { publicKey, privateKey } = generateMockKeyPair();
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      toast({
        title: "Keys Generated",
        description: "Your new key pair has been successfully generated.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Crypto Error",
        description: "Secure key generation is not supported in this browser.",
      });
    }
  };

  const handleCopy = (key, type) => {
    if (!navigator.clipboard) {
      toast({
        variant: "destructive",
        title: "Clipboard Error",
        description: "Clipboard API not available in this browser.",
      });
      return;
    }
    navigator.clipboard
      .writeText(key)
      .then(() => {
        setCopiedKey(type);
        toast({
          title: "Copied to Clipboard",
          description: `Your ${type} key has been copied.`,
        });
        setTimeout(() => setCopiedKey(null), 2000);
      })
      .catch((err) => {
        console.error("Clipboard error:", err);
        toast({
          variant: "destructive",
          title: "Clipboard Error",
          description: `Failed to copy ${type} key.`,
        });
      });
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-6 text-left">
      <Button
        onClick={handleGenerateKeys}
        className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        <KeyRound className="mr-2 h-5 w-5" />
        Generate New Key Pair
      </Button>
      <div className="space-y-4">
        {publicKey && (
          <div className="space-y-2">
            <Label htmlFor="publicKey" className="font-headline text-lg">
              Public Key
            </Label>
            <div className="relative">
              <Textarea
                id="publicKey"
                value={publicKey}
                readOnly
                className="pr-12 h-24 font-code"
                aria-label="Public Key"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground"
                onClick={() => handleCopy(publicKey, "public")}
                aria-label="Copy public key"
              >
                {copiedKey === "public" ? (
                  <Check className="h-5 w-5 text-chart-2" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        )}
        {privateKey && (
          <div className="space-y-2">
            <Label htmlFor="privateKey" className="font-headline text-lg">
              Private Key
            </Label>
            <div className="relative">
              <Textarea
                id="privateKey"
                value={privateKey}
                readOnly
                className="pr-12 h-24 font-code"
                aria-label="Private Key"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground"
                onClick={() => handleCopy(privateKey, "private")}
                aria-label="Copy private key"
              >
                {copiedKey === "private" ? (
                  <Check className="h-5 w-5 text-chart-2" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

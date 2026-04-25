"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileSignature, Copy, Check, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const mockSign = async (data, privateKey) => {
  if (!privateKey || !privateKey.startsWith('PRIV_')) return '';
  const combined = `${data}:${privateKey}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(combined);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const keyId = privateKey.split('_')[1];
  return `sig_${keyId}_${hashHex}`;
};

export default function DataSigner({
  data,
  setData,
  privateKey,
  signature,
  setSignature,
}) {
  const [localPrivateKey, setLocalPrivateKey] = useState(privateKey);
  const [isCopied, setIsCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setLocalPrivateKey(privateKey);
    }
  }, [privateKey, isClient]);

  const handleSignData = async () => {
    if (!data || !localPrivateKey) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both data to sign and a private key.",
      });
      return;
    }
    const newSignature = await mockSign(data, localPrivateKey);
    setSignature(newSignature);
    toast({
      title: "Signature Generated",
      description: "The digital signature for your data has been created.",
    });
  };

  const handleCopy = () => {
    if (!signature) return;
    if (!navigator.clipboard) {
      toast({
        variant: "destructive",
        title: "Clipboard Error",
        description: "Clipboard API not available in this browser.",
      });
      return;
    }
    navigator.clipboard
      .writeText(signature)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Copied to Clipboard",
          description: "The signature has been copied.",
        });
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Clipboard error:", err);
        toast({
          variant: "destructive",
          title: "Clipboard Error",
          description: "Failed to copy signature.",
        });
      });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        setData(text);
        toast({
          title: "File Loaded",
          description: `${file.name} has been loaded for signing.`,
        });
      };
      reader.onerror = () => {
        toast({
          variant: "destructive",
          title: "Error Reading File",
          description: "There was an error reading the file.",
        });
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="data-to-sign" className="font-headline">
            Data to Sign
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.json,.md,.csv,text/plain,application/json"
          />
        </div>
        <Textarea
          id="data-to-sign"
          placeholder="Enter text, paste file content, or upload a document..."
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="h-32 font-body text-base"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signer-private-key" className="font-headline">
          Your Private Key
        </Label>
        <Textarea
          id="signer-private-key"
          placeholder="Paste your private key here..."
          value={localPrivateKey}
          onChange={(e) => setLocalPrivateKey(e.target.value)}
          className="h-24 font-code"
        />
      </div>
      <Button
        onClick={handleSignData}
        className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        <FileSignature className="mr-2 h-5 w-5" />
        Generate Signature
      </Button>

      {signature && (
        <div className="space-y-2 pt-4">
          <Label
            htmlFor="generated-signature"
            className="font-headline text-lg"
          >
            Generated Signature
          </Label>
          <div className="relative">
            <Textarea
              id="generated-signature"
              value={signature}
              readOnly
              className="pr-12 h-24 font-code bg-muted/50"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground"
              onClick={handleCopy}
              aria-label="Copy signature"
            >
              {isCopied ? (
                <Check className="h-5 w-5 text-chart-2" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

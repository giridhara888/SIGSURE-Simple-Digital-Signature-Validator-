"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  ShieldX,
  Loader2,
  ShieldQuestion,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const mockVerify = async (data, signature, publicKey) => {
  if (
    !publicKey.startsWith("PUB_") ||
    !signature.startsWith("sig_")
  ) {
    return false;
  }

  const pubKeyId = publicKey.split("_")[1];
  const [sigPrefix, sigKeyId, sigHash] = signature.split("_");

  if (pubKeyId !== sigKeyId) {
    return false;
  }

  const privateKey = publicKey.replace(/^PUB_/, "PRIV_");
  const combined = `${data}:${privateKey}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(combined);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const expectedHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return sigHash === expectedHash;
};

export default function SignatureVerifier({
  data,
  setData,
  publicKey,
  signature,
  setSignature,
}) {
  const [localPublicKey, setLocalPublicKey] = useState(publicKey);
  const [status, setStatus] = useState("idle");
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if(isClient) {
      setLocalPublicKey(publicKey);
    }
  }, [publicKey, isClient]);

  useEffect(() => {
    setStatus("idle");
  }, [data, signature, localPublicKey]);

  const { toast } = useToast();

  const handleVerify = async () => {
    if (!data || !localPublicKey || !signature) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description:
          "Please provide original data, a public key, and a signature to verify.",
      });
      return;
    }

    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isValid = await mockVerify(data, signature, localPublicKey);
    setStatus(isValid ? "valid" : "invalid");
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
          description: `${file.name} has been loaded for verification.`,
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

  const getResultCard = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-headline text-lg">Verifying Signature...</p>
          </div>
        );
      case "valid":
        return (
          <Card className="bg-chart-2/10 border-chart-2/50">
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <ShieldCheck className="h-16 w-16 text-chart-2" />
              <h3 className="text-2xl font-bold font-headline text-chart-2">
                Signature is Valid
              </h3>
              <p className="text-center font-body text-chart-2/90">
                The signature has been successfully verified against the
                provided data and public key.
              </p>
            </CardContent>
          </Card>
        );
      case "invalid":
        return (
          <Card className="bg-destructive/10 border-destructive/50">
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
              <ShieldX className="h-16 w-16 text-destructive" />
              <h3 className="text-2xl font-bold font-headline text-destructive">
                Signature is Invalid
              </h3>
              <p className="text-center font-body text-destructive/90">
                The signature does not match the data and public key. The data
                may have been tampered with, or the key is incorrect.
              </p>
            </CardContent>
          </Card>
        );
      case "idle":
      default:
        return (
          <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground p-8 border-2 border-dashed rounded-lg">
            <ShieldQuestion className="h-12 w-12" />
            <p className="font-headline text-lg">Awaiting Verification</p>
            <p className="text-sm font-body">Results will be displayed here.</p>
          </div>
        );
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="space-y-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="verifier-data" className="font-headline">
              Original Data
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
            id="verifier-data"
            placeholder="Paste the original data, or upload a document..."
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="h-32 font-body text-base"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="verifier-public-key" className="font-headline">
            Public Key
          </Label>
          <Textarea
            id="verifier-public-key"
            placeholder="Paste the public key here..."
            value={localPublicKey}
            onChange={(e) => setLocalPublicKey(e.target.value)}
            className="h-32 font-code"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="verifier-signature" className="font-headline">
          Digital Signature
        </Label>
        <Textarea
          id="verifier-signature"
          placeholder="Paste the signature here..."
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          className="h-24 font-code"
        />
      </div>

      <Button
        onClick={handleVerify}
        disabled={status === "loading"}
        className="w-full sm:w-auto"
      >
        {status === "loading" ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <ShieldCheck className="mr-2 h-5 w-5" />
        )}
        Verify Signature
      </Button>

      <div className="pt-6">{getResultCard()}</div>
    </div>
  );
}

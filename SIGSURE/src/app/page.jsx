"use client";

import { useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  FileSignature,
  ShieldCheck,
  LockIcon,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KeyGenerator from "@/components/sign-verify/key-generator.js";
import DataSigner from "@/components/sign-verify/data-signer.js";
import SignatureVerifier from "@/components/sign-verify/signature-verifier.js";

export default function Home() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [data, setData] = useState("");
  const [signature, setSignature] = useState("");

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="z-10 w-full max-w-4xl items-center justify-between">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-md">
            <LockIcon className="h-8 w-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-headline font-bold tracking-tight text-foreground">
            SIGSURE
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground font-body">
            Stop guessing. Start authenticating.
          </p>
        </div>

        <Tabs defaultValue="generate-keys" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-12 rounded-lg">
            <TabsTrigger value="generate-keys" className="py-2.5 text-base">
              <KeyRound className="mr-2 h-5 w-5" />
              1. Generate Keys
            </TabsTrigger>
            <TabsTrigger value="sign-data" className="py-2.5 text-base">
              <FileSignature className="mr-2 h-5 w-5" />
              2. Sign Data
            </TabsTrigger>
            <TabsTrigger value="verify-signature" className="py-2.5 text-base">
              <ShieldCheck className="mr-2 h-5 w-5" />
              3. Verify Signature
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate-keys" className="mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Key Pair Generation
                </CardTitle>
                <CardDescription className="font-body text-base">
                  Create a new public/private key pair for your digital
                  signatures.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <KeyGenerator
                  publicKey={publicKey}
                  setPublicKey={setPublicKey}
                  privateKey={privateKey}
                  setPrivateKey={setPrivateKey}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sign-data" className="mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Create Digital Signature
                </CardTitle>
                <CardDescription className="font-body text-base">
                  Sign your text data using your private key.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataSigner
                  data={data}
                  setData={setData}
                  privateKey={privateKey}
                  publicKey={publicKey}
                  signature={signature}
                  setSignature={setSignature}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify-signature" className="mt-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  Verify Signature
                </CardTitle>
                <CardDescription className="font-body text-base">
                  Validate a signature against the original data and the public
                  key.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignatureVerifier
                  data={data}
                  setData={setData}
                  publicKey={publicKey}
                  signature={signature}
                  setSignature={setSignature}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-8 text-center">
          <Link
            href="/diagrams"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View System Architecture Diagrams
          </Link>
        </div>
      </div>
    </main>
  );
}

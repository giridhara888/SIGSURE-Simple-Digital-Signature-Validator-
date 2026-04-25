import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const componentArchitectureDiagram = `
graph TD
    subgraph "app/page.jsx (Main Component)"
        A[State <br/>(publicKey, privateKey, data, signature)]
        PageLayout(UI Layout & Tabs Container)
        A --> PageLayout
    end

    subgraph "Child Components"
        B(KeyGenerator.jsx)
        C(DataSigner.jsx)
        D(SignatureVerifier.jsx)
    end

    PageLayout --> B
    PageLayout --> C
    PageLayout --> D

    A -- Props --> B
    A -- Props --> C
    A -- Props --> D

    B -- "setPublicKey(), setPrivateKey()" --> A
    C -- "setData(), setSignature()" --> A
    D -- "setData(), setSignature()" --> A

    style A fill:#0d1a26,stroke:#2b4f6b,stroke-width:2px,color:#fff
    style PageLayout fill:#1b2d40,stroke:#2b4f6b,stroke-width:2px,color:#fff
    style B fill:#3a6a9b,stroke:#5fa4e0,stroke-width:1px,color:#fff
    style C fill:#3a6a9b,stroke:#5fa4e0,stroke-width:1px,color:#fff
    style D fill:#3a6a9b,stroke:#5fa4e0,stroke-width:1px,color:#fff
`;

const dataFlowDiagram = `
sequenceDiagram
    participant User
    participant Page as "app/page.jsx (State)"
    participant KeyGen as "KeyGenerator"
    participant Signer as "DataSigner"
    participant Verifier as "SignatureVerifier"

    User->>KeyGen: 1. Clicks "Generate Keys"
    activate KeyGen
    KeyGen->>Page: setPublicKey(), setPrivateKey()
    deactivate KeyGen
    Note over User, Page: State is updated centrally

    User->>Signer: 2. Enters Data & Clicks "Generate Signature"
    activate Signer
    Signer->>Page: setSignature()
    deactivate Signer
    Note over User, Page: State is updated again

    User->>Verifier: 3. Clicks "Verify Signature"
    activate Verifier
    Verifier-->>User: Displays "Valid" or "Invalid" status
    deactivate Verifier
`;

export default function DiagramsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background text-foreground">
      <div className="w-full max-w-5xl">
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Application
          </Link>
        </div>

        <div className="flex flex-col items-center gap-4 text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-headline font-bold tracking-tight text-foreground">
            System Diagrams
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground font-body">
            Visual overview of the SIGSURE application's architecture and data
            flow.
          </p>
        </div>

        <div className="mb-12 rounded-lg overflow-hidden shadow-2xl">
          <Image
            src="https://picsum.photos/seed/arch1/1200/600"
            alt="Abstract representation of a software architecture diagram"
            width={1200}
            height={600}
            className="w-full object-cover"
            data-ai-hint="architecture diagram"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                1. Component Architecture & State Management
              </CardTitle>
              <CardDescription className="font-body text-base">
                This diagram shows how components are organized and how state is
                managed centrally in the main page component.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-card-foreground/5 rounded-lg">
                <pre className="text-sm font-code text-left overflow-auto">
                  <code>{componentArchitectureDiagram}</code>
                </pre>
              </div>
              <div className="mt-4 text-sm text-muted-foreground font-body">
                <p>
                  <strong>Explanation:</strong> The main page component holds the
                  application's state. This state is passed down to child
                  components (KeyGenerator, DataSigner, SignatureVerifier) as
                  props. When a child component needs to update the state, it
                  calls a function (also passed via props) to update the state in
                  the parent, ensuring a unidirectional data flow.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                2. User Data Flow
              </CardTitle>
              <CardDescription className="font-body text-base">
                This sequence diagram illustrates the flow of data as a user
                interacts with the application from start to finish.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-card-foreground/5 rounded-lg">
                <pre className="text-sm font-code text-left overflow-auto">
                  <code>{dataFlowDiagram}</code>
                </pre>
              </div>
              <div className="mt-4 text-sm text-muted-foreground font-body">
                <p>
                  <strong>Explanation:</strong> The user initiates actions in the
                  child components. These components then communicate with the
                  main page component to update the central state. The UI
                  re-renders with the new state, providing a seamless experience.
                  The final verification step is self-contained within the
                  verifier component, which reads from the central state.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            Note: These diagrams use Mermaid syntax. You can copy the code and
            paste it into a Mermaid.js viewer to see the rendered chart.
          </p>
        </div>
      </div>
    </main>
  );
}

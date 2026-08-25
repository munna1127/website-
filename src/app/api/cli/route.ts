export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  const profileData = {
    engineer: "Aryan Tomar",
    title: "Security Researcher & Systems Automation Engineer",
    platform: "Native Android Termux POSIX Sandbox",
    status: "Operational / Available for Systems & Defense Engineering",
    skills: {
      languages: ["JavaScript (ESNext)", "TypeScript", "Python 3.x", "SQL", "POSIX Shell"],
      backend: ["Next.js 16 (App Router)", "Node.js", "Flask", "REST APIs", "Webhooks"],
      database: ["Neon Serverless PostgreSQL", "Prisma ORM", "pg-pool"],
      security: ["Information Theory (Shannon Entropy)", "DNS/OSINT Recon", "Cryptographic Digests"],
    },
    tools: {
      entropyEngine: "https://website-beta-rose-83.vercel.app/tools/entropy",
      osintRecon: "https://website-beta-rose-83.vercel.app/tools/recon",
      cryptographicHash: "https://website-beta-rose-83.vercel.app/tools/hash",
    },
    repositories: {
      authSim: "https://github.com/munna1127/secure-authsim-core",
      osintNexus: "https://github.com/munna1127/osint-nexus-core",
      geoAudit: "https://github.com/munna1127/geoaudit-telemetry-sim",
      mediaForensics: "https://github.com/munna1127/ephemeral-media-forensics",
    },
    contact: {
      web: "https://website-beta-rose-83.vercel.app/contact",
      api: "POST https://website-beta-rose-83.vercel.app/api/contact",
    }
  };

  // Return standard JSON if requested (?format=json)
  if (format === "json") {
    return NextResponse.json(profileData);
  }

  // ANSI Color Codes for Terminal Output
  const c = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    magenta: "\x1b[35m",
    blue: "\x1b[34m",
    dim: "\x1b[2m",
  };

  const cliOutput = `
${c.cyan}${c.bold}======================================================================${c.reset}
${c.magenta}${c.bold}   ___                           _____                           
  / _ \\  _ __ _   _  __ _ _ __  |_   _|__  _ __ ___   __ _ _ __  
 / /_\\ \\| '__| | | |/ _\` | '_ \\   | |/ _ \\| '_ \` _ \\ / _\` | '__| 
|  _  || |  | |_| | (_| | | | |  | | (_) | | | | | | (_| | |    
|_| |_||_|   \\__, |\\__,_|_| |_|  |_|\\___/|_| |_| |_|\\__,_|_|    
             |___/                                               ${c.reset}
${c.dim}  Systems Programming • Defensive Telemetry • Mobile POSIX Engineer${c.reset}
${c.cyan}${c.bold}======================================================================${c.reset}

${c.yellow}${c.bold}[+] OPERATOR:${c.reset}       ${profileData.engineer}
${c.yellow}${c.bold}[+] ROLE:${c.reset}           ${profileData.title}
${c.yellow}${c.bold}[+] ARCHITECTURE:${c.reset}   ${profileData.platform}

${c.green}${c.bold}── CORE STACK & CAPABILITIES ──${c.reset}
${c.bold}• Languages:${c.reset}     ${profileData.skills.languages.join(", ")}
${c.bold}• Backend:${c.reset}       ${profileData.skills.backend.join(", ")}
${c.bold}• Databases:${c.reset}     ${profileData.skills.database.join(", ")}
${c.bold}• Security:${c.reset}      ${profileData.skills.security.join(", ")}

${c.blue}${c.bold}── LIVE DEFENSE TOOLS ──${c.reset}
${c.bold}• Shannon Entropy:${c.reset} ${profileData.tools.entropyEngine}
${c.bold}• OSINT Recon:${c.reset}     ${profileData.tools.osintRecon}
${c.bold}• Hash Digests:${c.reset}    ${profileData.tools.cryptographicHash}

${c.magenta}${c.bold}── OPEN SOURCE REPOSITORIES ──${c.reset}
• ${profileData.repositories.authSim}
• ${profileData.repositories.osintNexus}
• ${profileData.repositories.geoAudit}
• ${profileData.repositories.mediaForensics}

${c.cyan}${c.bold}── INTERACTIVE API TRANSMISSION ──${c.reset}
To transmit direct message via terminal:
${c.dim}curl -X POST https://website-beta-rose-83.vercel.app/api/contact \\
  -H "Content-Type: application/json" \\
  -d '{"name":"YourName","contact":"email@target.com","message":"Hello Aryan"}'${c.reset}

${c.dim}JSON Raw Output: curl https://website-beta-rose-83.vercel.app/api/cli?format=json${c.reset}
${c.cyan}${c.bold}======================================================================${c.reset}
`;

  return new Response(cliOutput, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

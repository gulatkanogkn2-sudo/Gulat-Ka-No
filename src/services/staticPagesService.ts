export type PageCategory = 'Company' | 'Support';
export type PageStatus = 'Published' | 'Draft' | 'Hidden';

export interface PageVersion {
  id: string;
  editedAt: string;
  editedBy: string;
  title: string;
  content: string;
  status: PageStatus;
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  openGraphImage: string;
}

export interface StaticPage {
  id: string;
  slug: string;
  category: PageCategory;
  title: string;
  content: string;
  status: PageStatus;
  lastEdited: string;
  editedBy: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  openGraphImage: string;
  versions: PageVersion[];
}

const STORAGE_KEY = 'gkn_static_pages_v2';

const DEFAULT_STATIC_PAGES: StaticPage[] = [
  // COMPANY CATEGORY
  {
    id: 'page-about',
    slug: 'about',
    category: 'Company',
    title: 'About GKN',
    content: `# About GKN Platform

GKN is a next-generation laboratory research platform dedicated to facilitating high-purity synthetic peptide research, bulk analytical reference allocations, and automated documentation access for qualified laboratories worldwide.

## Our Mission

To empower biomedical researchers, analytical chemists, and academic institutions with pristine, sequence-verified reference materials backed by comprehensive Third-Party Certificates of Analysis (COA).

## Core Commitments

- **High Sequence Purity**: All batch allocations are guaranteed 99%+ analytical purity.
- **Full Transparency**: Direct public and researcher access to complete batch-level testing archives.
- **Strict Compliance**: Strictly for in vitro analytical research and laboratory investigation. Not for human, clinical, or veterinary administration.`,
    status: 'Published',
    lastEdited: new Date().toISOString(),
    editedBy: 'System Administrator',
    seoTitle: 'About GKN — Analytical Peptide Research Platform',
    metaDescription: 'Learn about the GKN laboratory platform, our mission, high-purity standards, and COA verification protocols.',
    keywords: 'GKN, peptide research, analytical purity, laboratory reference',
    openGraphImage: '',
    versions: [
      {
        id: 'v1-about',
        editedAt: new Date().toISOString(),
        editedBy: 'System Administrator',
        title: 'About GKN',
        content: 'Initial GKN Platform overview version.',
        status: 'Published',
        seoTitle: 'About GKN',
        metaDescription: 'Platform overview.',
        keywords: 'GKN, research',
        openGraphImage: '',
      },
    ],
  },
  {
    id: 'page-terms',
    slug: 'terms-of-service',
    category: 'Company',
    title: 'Terms of Service',
    titleAliases: ['terms'],
    content: `# Terms of Service

**IMPORTANT NOTICE**: PLEASE READ THESE TERMS OF SERVICE CAREFULLY BEFORE ACCESSING OR ORDERING FROM THE GKN PLATFORM.

## 1. Laboratory Use Only Notice

All products cataloged on the GKN platform are manufactured, sold, and distributed strictly for **in vitro laboratory research and analytical testing purposes only**.

- Products are **NOT FOR HUMAN CONSUMPTION**, diagnostic, therapeutic, cosmetic, or agricultural applications.
- Under no circumstances shall any item be introduced into humans or animals.
- Purchaser warrants that they represent a qualified research institution, university, laboratory, or licensed analytical professional.

## 2. Purchaser Qualifications & Compliance

By placing an order, the purchaser agrees that:
- They are at least 21 years of age.
- They possess the equipment, facilities, and technical knowledge required for safe storage and handling of research compounds.
- They will comply with all national, federal, state, and local regulatory guidelines.

## 3. Orders & Payment Terms

All allocations are processed through verified research accounts. Payments must be verified before dispatch or batch threshold lock-in.`,
    status: 'Published',
    lastEdited: new Date().toISOString(),
    editedBy: 'Legal Compliance Team',
    seoTitle: 'Terms of Service — GKN Research Platform',
    metaDescription: 'Official terms of service and strict laboratory research compliance notice for the GKN platform.',
    keywords: 'terms of service, laboratory research, compliance, analytical use only',
    openGraphImage: '',
    versions: [],
  } as any,
  {
    id: 'page-privacy',
    slug: 'privacy-policy',
    category: 'Company',
    title: 'Privacy Policy',
    titleAliases: ['privacy'],
    content: `# Privacy Policy

GKN values the confidentiality, security, and integrity of research institutional data.

## 1. Information We Collect

We collect minimal technical information required to verify laboratory accounts, process order allocations, and maintain secure access logs:
- Account details (Email, Institution name, Shipping address)
- Order history and ledger verification details
- Encrypted authentication tokens

## 2. Data Protection & Encryption

- All communications are encrypted in transit via SSL/TLS 1.3 protocols.
- We do not sell, rent, or distribute client laboratory data to third parties under any circumstances.
- Payment details are verified securely without storing unencrypted financial credentials.

## 3. Data Retention & Deletion

Researchers may request full account data deletion or export by contacting our support desk.`,
    status: 'Published',
    lastEdited: new Date().toISOString(),
    editedBy: 'Security & Privacy Desk',
    seoTitle: 'Privacy Policy — GKN Research Platform',
    metaDescription: 'GKN data privacy policy, encryption protocols, and research client confidentiality standards.',
    keywords: 'privacy policy, data security, SSL encryption, confidential research',
    openGraphImage: '',
    versions: [],
  },
  {
    id: 'page-disclaimer',
    slug: 'disclaimer',
    category: 'Company',
    title: 'Disclaimer',
    content: `# Laboratory Research Disclaimer

**CRITICAL COMPLIANCE NOTICE**

The products provided on this platform are intended **SOLELY FOR LABORATORY AND ANALYTICAL RESEARCH PURPOSES**.

### Strict Restrictions:
1. **Not for Human Use**: No compound sold on this platform is intended for human or animal consumption, injection, ingestion, inhalation, or topical application.
2. **No Medical Claims**: Statements made on this platform have not been evaluated by the FDA or international health authorities. Compounds are not intended to diagnose, treat, cure, or prevent any disease.
3. **Handling Hazard**: Research materials must be handled exclusively by qualified personnel equipped with proper personal protective equipment (PPE) inside controlled laboratory environments.`,
    status: 'Published',
    lastEdited: new Date().toISOString(),
    editedBy: 'Compliance Office',
    seoTitle: 'Research Disclaimer — GKN Platform',
    metaDescription: 'Critical laboratory research disclaimer and compliance guidelines for GKN reference materials.',
    keywords: 'disclaimer, research use only, non-clinical, safety notice',
    openGraphImage: '',
    versions: [],
  },

  // SUPPORT CATEGORY
  {
    id: 'page-contact',
    slug: 'contact',
    category: 'Support',
    title: 'Contact Us',
    content: `# Contact GKN Support Desk

Our technical research assistance desk is available to assist qualified laboratories with batch allocation inquiries, COA verification, and shipping logistics.

## Direct Inquiries

- **Technical Support Email**: support@gkn.research
- **WhatsApp Direct Line**: +1 (555) 019-2831
- **Operating Hours**: Monday – Friday, 08:00 – 18:00 UTC

## Priority Verification Desk

For urgent batch COA requests or custom MOQ sequence inquiries, please submit your research account reference ID in all email correspondence for expedited processing.`,
    status: 'Published',
    lastEdited: new Date().toISOString(),
    editedBy: 'Support Management',
    seoTitle: 'Contact Us — GKN Support Desk',
    metaDescription: 'Get in touch with the GKN technical support team for batch allocation and COA verification assistance.',
    keywords: 'contact support, GKN support, technical assistance, COA verification',
    openGraphImage: '',
    versions: [],
  },
  {
    id: 'page-faq',
    slug: 'faq',
    category: 'Support',
    title: 'FAQ',
    content: `# Frequently Asked Questions

### Q1: What is the purity level of GKN research peptides?
All catalog items maintain a minimum verified analytical purity of **99.0%+**.

### Q2: How do I obtain a Certificate of Analysis (COA) for my batch?
COAs are accessible directly via our public **COA Library** or by scanning the QR code printed on every physical vial label.

### Q3: What is the difference between GroupBuy, OnHand, and MOQ?
- **GroupBuy**: Community batch allocations with tiered threshold pricing.
- **OnHand**: Immediate inventory ready for swift dispatch.
- **MOQ**: Custom volume quota reservations for large-scale laboratory runs.

### Q4: Are products suitable for clinical or personal use?
**NO.** All items are strictly for in vitro laboratory research and analytical testing.`,
    status: 'Published',
    lastEdited: new Date().toISOString(),
    editedBy: 'Support Team',
    seoTitle: 'Frequently Asked Questions — GKN Platform',
    metaDescription: 'Answers to common questions about GKN peptide purity, COA library, shipping, and store options.',
    keywords: 'FAQ, peptide purity, COA, groupbuy, onhand, MOQ, support',
    openGraphImage: '',
    versions: [],
  },
  {
    id: 'page-shipping',
    slug: 'shipping',
    category: 'Support',
    title: 'Shipping Policy',
    content: `# Shipping Policy & Dispatch Logistics

GKN utilizes protective packaging to ensure compound integrity during transit.

## Dispatch Timelines

- **OnHand Inventory**: Dispatched within **24–48 hours** of order verification.
- **GroupBuy Batches**: Dispatched upon completion and QC testing of the batch threshold run (typically 5–10 business days).
- **MOQ Orders**: Timelines provided upon custom synthesis scheduling.

## Packaging Standards

All vials are sealed with tamper-evident caps and packed in insulated, protective shock-resistant vacuum casings. Cold packs are included for temperature-sensitive lyophilized compounds.

## Tracking & Verification

Tracking references are generated automatically and sent to your registered email or viewable in the **Order Tracker**.`,
    status: 'Published',
    lastEdited: new Date().toISOString(),
    editedBy: 'Fulfillment Logistics Desk',
    seoTitle: 'Shipping Policy — GKN Dispatch Logistics',
    metaDescription: 'Detailed dispatch timelines, protective packaging, and tracking information.',
    keywords: 'shipping policy, dispatch, order tracking, laboratory delivery',
    openGraphImage: '',
    versions: [],
  },
  {
    id: 'page-returns',
    slug: 'returns',
    category: 'Support',
    title: 'Returns Policy',
    content: `# Returns & Quality Guarantee Policy

Due to strict laboratory hygiene standards, opened or unsealed research compounds cannot be returned for restock.

## Damaged or Defective Items Guarantee

If an item arrives damaged in transit or fails analytical verification:
1. Contact us within **14 days** of package receipt.
2. Provide photos of the unsealed shipping container and vial batch seal.
3. Include your order reference ID if applicable.

Verified claims are eligible for an immediate replacement dispatch or account credit.`,
    status: 'Published',
    lastEdited: new Date().toISOString(),
    editedBy: 'Quality Assurance Team',
    seoTitle: 'Returns Policy — GKN Quality Guarantee',
    metaDescription: 'Information on GKN replacement guarantees, transit damage policies, and analytical verification claims.',
    keywords: 'returns policy, quality guarantee, replacement claim, laboratory standards',
    openGraphImage: '',
    versions: [],
  },
];

type PagesListener = (pages: StaticPage[]) => void;

class StaticPagesService {
  private listeners: Set<PagesListener> = new Set();
  private cachedPages: StaticPage[] | null = null;

  public getPages(): StaticPage[] {
    if (this.cachedPages) return this.cachedPages;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StaticPage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.cachedPages = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.error('[StaticPagesService] Failed to load from localStorage:', e);
    }

    this.cachedPages = DEFAULT_STATIC_PAGES;
    this.saveToStorage(DEFAULT_STATIC_PAGES);
    return DEFAULT_STATIC_PAGES;
  }

  public getPageBySlug(slug: string): StaticPage | undefined {
    const pages = this.getPages();
    const cleanSlug = slug.toLowerCase().replace(/^\/+/, '');
    
    // Direct match or alias match
    return pages.find((p) => {
      const pageSlug = p.slug.toLowerCase();
      if (pageSlug === cleanSlug) return true;
      if (cleanSlug === 'terms' && pageSlug === 'terms-of-service') return true;
      if (cleanSlug === 'privacy' && pageSlug === 'privacy-policy') return true;
      return false;
    });
  }

  public getPageById(id: string): StaticPage | undefined {
    return this.getPages().find((p) => p.id === id);
  }

  public savePage(updatedPage: StaticPage, editorName: string = 'Admin User'): StaticPage {
    const pages = this.getPages();
    const now = new Date().toISOString();

    const existingIndex = pages.findIndex((p) => p.id === updatedPage.id);
    let finalPage: StaticPage;

    if (existingIndex >= 0) {
      const current = pages[existingIndex];
      // Push previous state to version history
      const newVersion: PageVersion = {
        id: `v-${Date.now()}`,
        editedAt: current.lastEdited,
        editedBy: current.editedBy || 'Admin User',
        title: current.title,
        content: current.content,
        status: current.status,
        seoTitle: current.seoTitle,
        metaDescription: current.metaDescription,
        keywords: current.keywords,
        openGraphImage: current.openGraphImage,
      };

      finalPage = {
        ...updatedPage,
        lastEdited: now,
        editedBy: editorName,
        versions: [newVersion, ...(current.versions || [])].slice(0, 10), // Keep max 10
      };
      pages[existingIndex] = finalPage;
    } else {
      finalPage = {
        ...updatedPage,
        lastEdited: now,
        editedBy: editorName,
        versions: [],
      };
      pages.push(finalPage);
    }

    this.cachedPages = pages;
    this.saveToStorage(pages);
    this.notifyListeners(pages);
    return finalPage;
  }

  public restoreVersion(pageId: string, versionId: string, editorName: string = 'Admin User'): StaticPage | undefined {
    const pages = this.getPages();
    const page = pages.find((p) => p.id === pageId);
    if (!page || !page.versions) return undefined;

    const version = page.versions.find((v) => v.id === versionId);
    if (!version) return undefined;

    const restored: StaticPage = {
      ...page,
      title: version.title,
      content: version.content,
      status: version.status,
      seoTitle: version.seoTitle,
      metaDescription: version.metaDescription,
      keywords: version.keywords,
      openGraphImage: version.openGraphImage,
      lastEdited: new Date().toISOString(),
      editedBy: `${editorName} (Restored Version)`,
    };

    return this.savePage(restored, editorName);
  }

  public subscribe(listener: PagesListener): () => void {
    this.listeners.add(listener);
    listener(this.getPages());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private saveToStorage(pages: StaticPage[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    } catch (e) {
      console.error('[StaticPagesService] Error saving to localStorage:', e);
    }
  }

  private notifyListeners(pages: StaticPage[]): void {
    this.listeners.forEach((listener) => {
      try {
        listener(pages);
      } catch (err) {
        console.error('[StaticPagesService] Listener error:', err);
      }
    });
  }
}

export const staticPagesService = new StaticPagesService();

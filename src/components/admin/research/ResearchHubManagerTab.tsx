import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Edit2,
  Layers,
  Sparkles,
  Link as LinkIcon,
  BookOpen,
  Layout,
  RefreshCw,
  Star,
} from 'lucide-react';
import {
  ResearchHubHomepageAdmin,
  FeatureCardAdmin,
  CategoryCardAdmin,
  FeaturedArticleAdmin,
  QuickLinkAdmin,
  RepositoryUpdateAdmin,
} from '../../../types/researchLibraryManager';
import { MediaInput } from '../website/MediaAssetPickerModal';

interface ResearchHubManagerTabProps {
  hubSettings: ResearchHubHomepageAdmin;
  onSaveHubSettings: (settings: Partial<ResearchHubHomepageAdmin>) => void;
}

export const ResearchHubManagerTab: React.FC<ResearchHubManagerTabProps> = ({
  hubSettings,
  onSaveHubSettings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'cards' | 'categories' | 'articles' | 'links' | 'updates'>('hero');
  const [formData, setFormData] = useState<ResearchHubHomepageAdmin>(hubSettings);

  const handleSaveAll = () => {
    onSaveHubSettings(formData);
  };

  // Feature Card helpers
  const handleAddFeatureCard = () => {
    const newCard: FeatureCardAdmin = {
      id: `card-${Date.now()}`,
      title: 'New Feature Card',
      description: 'Describe feature capabilities...',
      iconName: 'FileCheck',
      linkUrl: '/research/coa-library',
      sortOrder: (formData.featureCards?.length || 0) + 1,
      visibility: 'PUBLIC',
    };
    setFormData({
      ...formData,
      featureCards: [...(formData.featureCards || []), newCard],
    });
  };

  const handleRemoveFeatureCard = (id: string) => {
    setFormData({
      ...formData,
      featureCards: formData.featureCards.filter((c) => c.id !== id),
    });
  };

  // Category helpers
  const handleAddCategory = () => {
    const newCat: CategoryCardAdmin = {
      id: `cat-${Date.now()}`,
      name: 'New Research Category',
      description: 'Category description and scope...',
      countText: '0 Verified Lots',
      iconName: 'Activity',
      targetUrl: '/research/coa-library',
      visibility: 'PUBLIC',
    };
    setFormData({
      ...formData,
      categories: [...(formData.categories || []), newCat],
    });
  };

  const handleRemoveCategory = (id: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((c) => c.id !== id),
    });
  };

  // Article helpers
  const handleAddArticle = () => {
    const newArt: FeaturedArticleAdmin = {
      id: `art-${Date.now()}`,
      title: 'New Analytical Research Article',
      category: 'Peptide Analysis',
      excerpt: 'Short summary excerpt for public research hub...',
      content: 'Detailed research article methodology, HPLC data, and mass spectrometry analysis...',
      readTime: '5 Min Read',
      date: 'August 2026',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
      articleUrl: '/research/coa-library',
      featured: true,
      visibility: 'PUBLIC',
    };
    setFormData({
      ...formData,
      featuredArticles: [...(formData.featuredArticles || []), newArt],
    });
  };

  const handleRemoveArticle = (id: string) => {
    setFormData({
      ...formData,
      featuredArticles: formData.featuredArticles.filter((a) => a.id !== id),
    });
  };

  // Quick Link helpers
  const handleAddQuickLink = () => {
    const newLink: QuickLinkAdmin = {
      id: `ql-${Date.now()}`,
      title: 'New Quick Link',
      url: '/research/coa-library',
      badge: 'Link',
      visibility: 'PUBLIC',
    };
    setFormData({
      ...formData,
      quickLinks: [...(formData.quickLinks || []), newLink],
    });
  };

  const handleRemoveQuickLink = (id: string) => {
    setFormData({
      ...formData,
      quickLinks: formData.quickLinks.filter((l) => l.id !== id),
    });
  };

  // Repository Update helpers
  const handleAddRepositoryUpdate = () => {
    const newUpdate: RepositoryUpdateAdmin = {
      id: `rep-${Date.now()}`,
      title: 'New Repository Activity Update',
      description: 'Detail analytical update, lot release, or protocol guide...',
      timestamp: 'Just now',
      targetUrl: '/research/coa-library',
      badgeColor: 'cyan',
      visibility: 'PUBLIC',
    };
    setFormData({
      ...formData,
      repositoryUpdates: [...(formData.repositoryUpdates || []), newUpdate],
    });
  };

  const handleRemoveRepositoryUpdate = (id: string) => {
    setFormData({
      ...formData,
      repositoryUpdates: (formData.repositoryUpdates || []).filter((u) => u.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Save Trigger Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Public Research Hub Homepage Content
          </h3>
          <p className="text-xs text-slate-400">
            Control hero headers, feature cards, categories, articles, quick links, and repository updates.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5 flex-shrink-0"
        >
          <Check className="w-4 h-4" /> Save Hub Configuration
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('hero')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'hero'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Layout className="w-3.5 h-3.5" /> Hero Section
        </button>

        <button
          onClick={() => setActiveSubTab('cards')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'cards'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Feature Cards ({formData.featureCards?.length || 0})
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'categories'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Categories ({formData.categories?.length || 0})
        </button>

        <button
          onClick={() => setActiveSubTab('articles')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'articles'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Articles ({formData.featuredArticles?.length || 0})
        </button>

        <button
          onClick={() => setActiveSubTab('links')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'links'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" /> Quick Links ({formData.quickLinks?.length || 0})
        </button>

        <button
          onClick={() => setActiveSubTab('updates')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'updates'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Repository Updates ({formData.repositoryUpdates?.length || 0})
        </button>
      </div>

      {/* Sub Tab: HERO SECTION */}
      {activeSubTab === 'hero' && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-sm font-bold text-white">Hero Section Configuration</h4>
            <select
              value={formData.heroSection?.visibility || 'PUBLIC'}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heroSection: { ...formData.heroSection, visibility: e.target.value as any },
                })
              }
              className="bg-slate-950 border border-slate-800 text-cyan-300 rounded-xl px-3 py-1 text-xs font-mono"
            >
              <option value="PUBLIC">PUBLIC</option>
              <option value="HIDDEN">HIDDEN</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Hero Title</label>
            <input
              type="text"
              value={formData.heroSection?.title || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heroSection: { ...formData.heroSection, title: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Hero Subtitle</label>
            <textarea
              rows={3}
              value={formData.heroSection?.subtitle || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  heroSection: { ...formData.heroSection, subtitle: e.target.value },
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Call to Action Button Label</label>
              <input
                type="text"
                value={formData.heroSection?.ctaText || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heroSection: { ...formData.heroSection, ctaText: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">CTA Target URL</label>
              <input
                type="text"
                value={formData.heroSection?.ctaUrl || '/research/coa-library'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    heroSection: { ...formData.heroSection, ctaUrl: e.target.value },
                  })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <MediaInput
            label="Hero Banner Image Reference"
            value={formData.heroSection?.bannerImageUrl || ''}
            onChange={(url) =>
              setFormData({
                ...formData,
                heroSection: { ...formData.heroSection, bannerImageUrl: url },
              })
            }
            description="Reference background banner asset from the Media Library."
          />
        </div>
      )}

      {/* Sub Tab: FEATURE CARDS */}
      {activeSubTab === 'cards' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleAddFeatureCard}
              className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Feature Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.featureCards?.map((card, idx) => (
              <div key={card.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">Card #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveFeatureCard(card.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const updated = [...formData.featureCards];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, featureCards: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={card.description}
                    onChange={(e) => {
                      const updated = [...formData.featureCards];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, featureCards: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Link URL</label>
                    <input
                      type="text"
                      value={card.linkUrl}
                      onChange={(e) => {
                        const updated = [...formData.featureCards];
                        updated[idx].linkUrl = e.target.value;
                        setFormData({ ...formData, featureCards: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Visibility</label>
                    <select
                      value={card.visibility}
                      onChange={(e) => {
                        const updated = [...formData.featureCards];
                        updated[idx].visibility = e.target.value as any;
                        setFormData({ ...formData, featureCards: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs font-mono text-slate-300"
                    >
                      <option value="PUBLIC">PUBLIC</option>
                      <option value="HIDDEN">HIDDEN</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: CATEGORIES */}
      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleAddCategory}
              className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.categories?.map((cat, idx) => (
              <div key={cat.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">Category #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveCategory(cat.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Name</label>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => {
                        const updated = [...formData.categories];
                        updated[idx].name = e.target.value;
                        setFormData({ ...formData, categories: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Badge / Count Text</label>
                    <input
                      type="text"
                      value={cat.countText}
                      onChange={(e) => {
                        const updated = [...formData.categories];
                        updated[idx].countText = e.target.value;
                        setFormData({ ...formData, categories: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={cat.description}
                    onChange={(e) => {
                      const updated = [...formData.categories];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, categories: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Link URL</label>
                    <input
                      type="text"
                      value={cat.targetUrl || '/research/coa-library'}
                      onChange={(e) => {
                        const updated = [...formData.categories];
                        updated[idx].targetUrl = e.target.value;
                        setFormData({ ...formData, categories: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Visibility</label>
                    <select
                      value={cat.visibility || 'PUBLIC'}
                      onChange={(e) => {
                        const updated = [...formData.categories];
                        updated[idx].visibility = e.target.value as any;
                        setFormData({ ...formData, categories: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs font-mono text-slate-300"
                    >
                      <option value="PUBLIC">PUBLIC</option>
                      <option value="HIDDEN">HIDDEN</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: FEATURED ARTICLES */}
      {activeSubTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleAddArticle}
              className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Research Article
            </button>
          </div>

          <div className="space-y-4">
            {formData.featuredArticles?.map((art, idx) => (
              <div key={art.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">Article #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveArticle(art.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Article Title</label>
                    <input
                      type="text"
                      value={art.title}
                      onChange={(e) => {
                        const updated = [...formData.featuredArticles];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, featuredArticles: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Category / Tag</label>
                    <input
                      type="text"
                      value={art.category}
                      onChange={(e) => {
                        const updated = [...formData.featuredArticles];
                        updated[idx].category = e.target.value;
                        setFormData({ ...formData, featuredArticles: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Excerpt Summary</label>
                  <textarea
                    rows={2}
                    value={art.excerpt}
                    onChange={(e) => {
                      const updated = [...formData.featuredArticles];
                      updated[idx].excerpt = e.target.value;
                      setFormData({ ...formData, featuredArticles: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Full Article Content Body</label>
                  <textarea
                    rows={3}
                    value={art.content || ''}
                    placeholder="Enter full article text/body for public reader modal..."
                    onChange={(e) => {
                      const updated = [...formData.featuredArticles];
                      updated[idx].content = e.target.value;
                      setFormData({ ...formData, featuredArticles: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Featured Research?</label>
                    <select
                      value={art.featured ? 'YES' : 'NO'}
                      onChange={(e) => {
                        const updated = [...formData.featuredArticles];
                        updated[idx].featured = e.target.value === 'YES';
                        setFormData({ ...formData, featuredArticles: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs font-mono text-amber-300"
                    >
                      <option value="YES">YES (Featured Section)</option>
                      <option value="NO">NO (Standard List)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Visibility</label>
                    <select
                      value={art.visibility}
                      onChange={(e) => {
                        const updated = [...formData.featuredArticles];
                        updated[idx].visibility = e.target.value as any;
                        setFormData({ ...formData, featuredArticles: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs font-mono text-slate-300"
                    >
                      <option value="PUBLIC">PUBLIC</option>
                      <option value="HIDDEN">HIDDEN</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Read Time / Date</label>
                    <input
                      type="text"
                      value={art.readTime}
                      onChange={(e) => {
                        const updated = [...formData.featuredArticles];
                        updated[idx].readTime = e.target.value;
                        setFormData({ ...formData, featuredArticles: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <MediaInput
                  label="Article Thumbnail Image Reference"
                  value={art.imageUrl}
                  onChange={(url) => {
                    const updated = [...formData.featuredArticles];
                    updated[idx].imageUrl = url;
                    setFormData({ ...formData, featuredArticles: updated });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: QUICK LINKS */}
      {activeSubTab === 'links' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleAddQuickLink}
              className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Quick Link
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formData.quickLinks?.map((link, idx) => (
              <div key={link.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2">
                <input
                  type="text"
                  value={link.title}
                  placeholder="Link Label"
                  onChange={(e) => {
                    const updated = [...formData.quickLinks];
                    updated[idx].title = e.target.value;
                    setFormData({ ...formData, quickLinks: updated });
                  }}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
                />

                <input
                  type="text"
                  value={link.url}
                  placeholder="URL Path"
                  onChange={(e) => {
                    const updated = [...formData.quickLinks];
                    updated[idx].url = e.target.value;
                    setFormData({ ...formData, quickLinks: updated });
                  }}
                  className="w-36 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-cyan-300"
                />

                <select
                  value={link.visibility || 'PUBLIC'}
                  onChange={(e) => {
                    const updated = [...formData.quickLinks];
                    updated[idx].visibility = e.target.value as any;
                    setFormData({ ...formData, quickLinks: updated });
                  }}
                  className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-[11px] font-mono"
                >
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="HIDDEN">HIDDEN</option>
                </select>

                <button
                  onClick={() => handleRemoveQuickLink(link.id)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tab: REPOSITORY UPDATES */}
      {activeSubTab === 'updates' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleAddRepositoryUpdate}
              className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Repository Update
            </button>
          </div>

          <div className="space-y-3">
            {formData.repositoryUpdates?.map((upd, idx) => (
              <div key={upd.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">Update Log #{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveRepositoryUpdate(upd.id)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Title</label>
                    <input
                      type="text"
                      value={upd.title}
                      onChange={(e) => {
                        const updated = [...(formData.repositoryUpdates || [])];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, repositoryUpdates: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Time Label / Date</label>
                    <input
                      type="text"
                      value={upd.timestamp}
                      onChange={(e) => {
                        const updated = [...(formData.repositoryUpdates || [])];
                        updated[idx].timestamp = e.target.value;
                        setFormData({ ...formData, repositoryUpdates: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={upd.description}
                    onChange={(e) => {
                      const updated = [...(formData.repositoryUpdates || [])];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, repositoryUpdates: updated });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Link URL</label>
                    <input
                      type="text"
                      value={upd.targetUrl || '/research/coa-library'}
                      onChange={(e) => {
                        const updated = [...(formData.repositoryUpdates || [])];
                        updated[idx].targetUrl = e.target.value;
                        setFormData({ ...formData, repositoryUpdates: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">Visibility</label>
                    <select
                      value={upd.visibility}
                      onChange={(e) => {
                        const updated = [...(formData.repositoryUpdates || [])];
                        updated[idx].visibility = e.target.value as any;
                        setFormData({ ...formData, repositoryUpdates: updated });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs font-mono text-slate-300"
                    >
                      <option value="PUBLIC">PUBLIC</option>
                      <option value="HIDDEN">HIDDEN</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Pill,
  Search,
  Calculator,
  Star,
  BookOpen,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Building2,
  Layers,
  Sparkles,
  ShieldCheck,
  Tag,
  Syringe,
  Boxes,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductImage } from './ProductImage';
import { COMMERCIAL_PRODUCTS, CommercialProduct } from '../data/commercialProducts';

export const DrugsView: React.FC = () => {
  const {
    openCalculatorWithCommercialProduct,
    favoriteDrugs,
    toggleFavoriteDrug,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('all');
  const [selectedFormType, setSelectedFormType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'hierarchy' | 'catalog'>('hierarchy');
  const [expandedPrinciple, setExpandedPrinciple] = useState<string | null>('Meloxicam');
  const [expandedProductDetailId, setExpandedProductDetailId] = useState<string | null>(null);

  // Computed metrics across entire library
  const stats = useMemo(() => {
    const totalPresentations = COMMERCIAL_PRODUCTS.length;
    const uniquePrinciples = new Set(COMMERCIAL_PRODUCTS.map((p) => p.activePrinciple.trim())).size;
    const uniqueBrands = new Set(
      COMMERCIAL_PRODUCTS.map((p) => p.brandName.split(/[®(]/)[0].trim())
    ).size;
    const uniqueManufacturers = new Set(
      COMMERCIAL_PRODUCTS.map((p) => p.manufacturer || 'Outro')
    ).size;

    return {
      totalPresentations,
      uniquePrinciples,
      uniqueBrands,
      uniqueManufacturers,
    };
  }, []);

  // Filter lists
  const categories = useMemo(() => {
    const list = Array.from(new Set(COMMERCIAL_PRODUCTS.map((p) => p.category)));
    return list.sort();
  }, []);

  const manufacturers = useMemo(() => {
    const list = Array.from(
      new Set(
        COMMERCIAL_PRODUCTS.map((p) => p.manufacturer).filter(Boolean) as string[]
      )
    );
    return list.sort();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return COMMERCIAL_PRODUCTS.filter((prod) => {
      const matchesSearch =
        !q ||
        prod.activePrinciple.toLowerCase().includes(q) ||
        prod.brandName.toLowerCase().includes(q) ||
        (prod.manufacturer && prod.manufacturer.toLowerCase().includes(q)) ||
        prod.category.toLowerCase().includes(q) ||
        prod.doseRangeText.toLowerCase().includes(q) ||
        (prod.clinicalNotes && prod.clinicalNotes.toLowerCase().includes(q));

      const matchesSpecies =
        selectedSpecies === 'all' ||
        prod.species.some((s) => s.toLowerCase().includes(selectedSpecies.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || prod.category === selectedCategory;

      const matchesMfg =
        selectedManufacturer === 'all' || prod.manufacturer === selectedManufacturer;

      const matchesForm =
        selectedFormType === 'all' ||
        (selectedFormType === 'tablet' && prod.formType === 'tablet') ||
        (selectedFormType === 'liquid' && prod.formType === 'liquid') ||
        (selectedFormType === 'drops' && prod.formType === 'drops') ||
        (selectedFormType === 'other' && ['topical', 'paste', 'spray'].includes(prod.formType));

      return matchesSearch && matchesSpecies && matchesCategory && matchesMfg && matchesForm;
    });
  }, [
    searchQuery,
    selectedSpecies,
    selectedCategory,
    selectedManufacturer,
    selectedFormType,
  ]);

  // Hierarchical Grouping: Active Principle -> Commercial Products
  const groupedByPrinciple = useMemo(() => {
    const map = new Map<string, { principle: string; category: string; products: CommercialProduct[] }>();

    for (const prod of filteredProducts) {
      const key = prod.activePrinciple.trim();
      if (!map.has(key)) {
        map.set(key, {
          principle: key,
          category: prod.category,
          products: [],
        });
      }
      map.get(key)!.products.push(prod);
    }

    return Array.from(map.values()).sort((a, b) =>
      a.principle.localeCompare(b.principle, 'pt-BR')
    );
  }, [filteredProducts]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header & Stats Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-[#DCE7F2] dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-[#E5FFF4] dark:bg-emerald-950/60 text-[#007F62] dark:text-[#00C896] border border-[#00C896]/30">
                <Pill className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black text-[#14243A] dark:text-white tracking-tight">
                Biblioteca Farmacológica Veterinária
              </h1>
            </div>
            <p className="text-xs text-[#52677F] dark:text-slate-400 mt-1 max-w-3xl">
              Catálogo oficial padronizado em hierarquia{' '}
              <strong className="text-[#14243A] dark:text-slate-200">
                Princípio Ativo → Marca Comercial → Laboratório → Apresentação → Concentração
              </strong>
              , com posologias de bula validadas e integração direta com a calculadora clínica.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-[#F5F9FD] dark:bg-slate-800 rounded-2xl border border-[#DCE7F2] dark:border-slate-700 w-full sm:w-auto overflow-x-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('hierarchy')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 min-h-[40px] whitespace-nowrap ${
                viewMode === 'hierarchy'
                  ? 'bg-white dark:bg-slate-900 text-[#007F62] dark:text-[#00C896] shadow-xs border border-[#DCE7F2] dark:border-slate-700'
                  : 'text-[#52677F] dark:text-slate-400 hover:text-[#14243A]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Hierarquia por Princípio</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('catalog')}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 min-h-[40px] whitespace-nowrap ${
                viewMode === 'catalog'
                  ? 'bg-white dark:bg-slate-900 text-[#007F62] dark:text-[#00C896] shadow-xs border border-[#DCE7F2] dark:border-slate-700'
                  : 'text-[#52677F] dark:text-slate-400 hover:text-[#14243A]'
              }`}
            >
              <Boxes className="w-3.5 h-3.5 shrink-0" />
              <span>Catálogo Geral ({filteredProducts.length})</span>
            </button>
          </div>
        </div>

        {/* 4 Official Distinct Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-[#F5F9FD] dark:bg-slate-800/80 border border-[#DCE7F2] dark:border-slate-700/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5FFF4] dark:bg-emerald-950/60 text-[#007F62] dark:text-[#00C896] flex items-center justify-center shrink-0 font-black">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-black text-[#14243A] dark:text-white">
                  {stats.totalPresentations}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E5FFF4] text-[#007F62] dark:bg-emerald-950 dark:text-[#00C896] font-bold">
                  500+ Ativo
                </span>
              </div>
              <p className="text-[11px] text-[#52677F] dark:text-slate-400 font-medium leading-tight">
                Apresentações / Formulações
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F9FD] dark:bg-slate-800/80 border border-[#DCE7F2] dark:border-slate-700/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-black">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-[#14243A] dark:text-white">
                {stats.uniquePrinciples}
              </span>
              <p className="text-[11px] text-[#52677F] dark:text-slate-400 font-medium leading-tight">
                Princípios Ativos Únicos
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F9FD] dark:bg-slate-800/80 border border-[#DCE7F2] dark:border-slate-700/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-black">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-[#14243A] dark:text-white">
                {stats.uniqueBrands}+
              </span>
              <p className="text-[11px] text-[#52677F] dark:text-slate-400 font-medium leading-tight">
                Marcas Registradas
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F9FD] dark:bg-slate-800/80 border border-[#DCE7F2] dark:border-slate-700/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-[#14243A] dark:text-white">
                {stats.uniqueManufacturers}
              </span>
              <p className="text-[11px] text-[#52677F] dark:text-slate-400 font-medium leading-tight">
                Laboratórios Fabricantes
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar & Multi-Criteria Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-2 border-t border-[#DCE7F2] dark:border-slate-800">
          {/* Search Box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar princípio ativo (ex: meloxicam), marca ou laboratório..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE7F2] dark:border-slate-700 bg-[#F5F9FD] dark:bg-slate-800 text-[#0F172A] dark:text-white text-xs placeholder:text-[#64748B] dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#00C896] focus:outline-none transition-all"
            />
          </div>

          {/* Species Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#DCE7F2] dark:border-slate-700 bg-[#F5F9FD] dark:bg-slate-800 text-[#0F172A] dark:text-white text-xs focus:ring-2 focus:ring-[#00C896] focus:outline-none"
            >
              <option value="all">Todas as Espécies</option>
              <option value="canino">Cães (Caninos)</option>
              <option value="felino">Gatos (Felinos)</option>
              <option value="equino">Equinos</option>
              <option value="bovino">Bovinos / Ruminantes</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#DCE7F2] dark:border-slate-700 bg-[#F5F9FD] dark:bg-slate-800 text-[#14243A] dark:text-white text-xs focus:ring-2 focus:ring-[#00C896] focus:outline-none truncate"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Manufacturer Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#DCE7F2] dark:border-slate-700 bg-[#F5F9FD] dark:bg-slate-800 text-[#14243A] dark:text-white text-xs focus:ring-2 focus:ring-[#00C896] focus:outline-none truncate"
            >
              <option value="all">Todos os Laboratórios</option>
              {manufacturers.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Pharmaceutical Form Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedFormType}
              onChange={(e) => setSelectedFormType(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#DCE7F2] dark:border-slate-700 bg-[#F5F9FD] dark:bg-slate-800 text-[#14243A] dark:text-white text-xs focus:ring-2 focus:ring-[#00C896] focus:outline-none"
            >
              <option value="all">Todas as Formas</option>
              <option value="tablet">Comprimidos / Cápsulas</option>
              <option value="liquid">Injetáveis / Soluções</option>
              <option value="drops">Gotas / Suspensões</option>
              <option value="other">Tópico / Pasta / Spray</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-[#DCE7F2] dark:border-slate-800 text-[#52677F]">
          <Pill className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="font-bold text-[#14243A] dark:text-slate-200">
            Nenhum produto encontrado com os filtros selecionados.
          </p>
          <p className="text-xs mt-1">
            Tente buscar por outro princípio ativo, marca ou redefinir os filtros acima.
          </p>
        </div>
      ) : viewMode === 'hierarchy' ? (
        /* =========================================================================
           VIEW 1: HIERARCHICAL VIEW (Princípio Ativo -> Marcas -> Laboratório -> Apresentações)
           ========================================================================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-xs font-bold text-[#52677F] dark:text-slate-400">
              Exibindo <span className="text-[#14243A] dark:text-white font-extrabold">{groupedByPrinciple.length}</span> princípios ativos com <span className="text-[#007F62] dark:text-[#00C896] font-extrabold">{filteredProducts.length}</span> formulações comerciais reais
            </p>
            <span className="text-[11px] text-[#52677F] dark:text-slate-400 italic">
              Clique em um princípio para visualizar suas marcas, laboratórios e concentrações
            </span>
          </div>

          {groupedByPrinciple.map((group) => {
            const isExpanded = expandedPrinciple === group.principle;
            const labs = Array.from(new Set(group.products.map((p) => p.manufacturer || 'Outro')));
            const forms = Array.from(new Set(group.products.map((p) => p.formType)));

            return (
              <div
                key={group.principle}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-[#DCE7F2] dark:border-slate-800 shadow-xs overflow-hidden transition-all"
              >
                {/* Active Principle Header */}
                <div
                  onClick={() =>
                    setExpandedPrinciple(isExpanded ? null : group.principle)
                  }
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-[#F5F9FD]/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#E5FFF4] dark:bg-emerald-950/60 text-[#007F62] dark:text-[#00C896] flex items-center justify-center shrink-0 mt-0.5 border border-[#00C896]/30">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h2 className="font-black text-base text-[#14243A] dark:text-white tracking-tight">
                          {group.principle}
                        </h2>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#E5FFF4] text-[#007F62] dark:bg-emerald-950/80 dark:text-[#00C896] font-bold border border-[#00C896]/20">
                          {group.products.length} {group.products.length === 1 ? 'apresentação' : 'apresentações'}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F5F9FD] dark:bg-slate-800 text-[#52677F] dark:text-slate-300 font-medium border border-[#DCE7F2] dark:border-slate-700">
                          {labs.length} {labs.length === 1 ? 'laboratório' : 'laboratórios'}
                        </span>
                      </div>
                      <p className="text-xs text-[#52677F] dark:text-slate-400 mt-0.5">
                        {group.category} • Marcas de referência: <strong className="text-[#14243A] dark:text-slate-300">{labs.slice(0, 4).join(', ')}{labs.length > 4 ? '...' : ''}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end md:self-center">
                    <span className="text-xs font-bold text-[#52677F] dark:text-slate-400 hidden sm:inline">
                      {isExpanded ? 'Recolher formulações' : 'Ver marcas e doses'}
                    </span>
                    <div className="p-1 text-[#52677F] dark:text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Presentations List */}
                {isExpanded && (
                  <div className="p-5 pt-3 border-t border-[#DCE7F2] dark:border-slate-800 bg-[#F5F9FD]/40 dark:bg-slate-900/60 space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      {group.products.map((prod) => {
                        const isFav = favoriteDrugs.includes(prod.id);
                        const isDetailOpen = expandedProductDetailId === prod.id;

                        return (
                          <div
                            key={prod.id}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#DCE7F2] dark:border-slate-700 shadow-xs hover:border-[#00C896]/50 transition-all space-y-3"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                              {/* Left Info: Brand, Lab, Concentration, Form */}
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                              <ProductImage product={prod} size={56} />
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center space-x-2 flex-wrap">
                                  <h3 className="font-bold text-sm text-[#14243A] dark:text-white">
                                    {prod.brandName}
                                  </h3>
                                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                                    {prod.manufacturer || 'Laboratório Oficial'}
                                  </span>
                                  {prod.percentage !== undefined && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                                      {prod.percentage}% ({prod.concentrationMgMl} mg/mL)
                                    </span>
                                  )}
                                  {prod.tabletMg !== undefined && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-[#007F62] dark:text-[#00C896] font-bold border border-emerald-200 dark:border-emerald-800">
                                      {prod.tabletMg} mg / comprimido
                                    </span>
                                  )}
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[#52677F] dark:text-slate-300 font-medium">
                                    {prod.presentationText || (prod.formType === 'tablet' ? 'Comprimidos' : 'Líquido')}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#52677F] dark:text-slate-400">
                                  <span>
                                    Espécies: <strong className="text-[#14243A] dark:text-slate-200">{prod.species.join(', ')}</strong>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Via: <strong className="text-[#14243A] dark:text-slate-200">{prod.defaultRoute}</strong>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Frequência: <strong className="text-[#14243A] dark:text-slate-200">{prod.defaultFrequency}</strong>
                                  </span>
                                </div>

                                <p className="text-[11px] text-[#007F62] dark:text-[#00C896] font-bold font-mono">
                                  {prod.doseRangeText}
                                </p>
                              </div>
                              </div>

                              {/* Right Actions: CALCULAR DOSE & Favorite */}
                              <div className="flex flex-wrap items-center gap-2 shrink-0 pt-1 sm:pt-0">
                                <button
                                  type="button"
                                  onClick={() => openCalculatorWithCommercialProduct(prod)}
                                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#00C896] hover:bg-[#00B084] text-[#062C23] font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer min-h-[40px]"
                                >
                                  <Calculator className="w-3.5 h-3.5 shrink-0" />
                                  <span>CALCULAR DOSE</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setExpandedProductDetailId(isDetailOpen ? null : prod.id)}
                                  className="px-3 py-2.5 rounded-xl border border-[#DCE7F2] dark:border-slate-700 text-[#52677F] dark:text-slate-300 hover:text-[#14243A] text-xs font-semibold min-h-[40px] flex items-center justify-center cursor-pointer"
                                  title="Ver bula e notas clínicas"
                                >
                                  {isDetailOpen ? 'Ocultar Bula' : 'Bula'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleFavoriteDrug(prod.id)}
                                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center ${
                                    isFav
                                      ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-500'
                                      : 'border-[#DCE7F2] dark:border-slate-700 text-[#52677F] hover:text-[#14243A]'
                                  }`}
                                  title={isFav ? 'Remover dos favoritos' : 'Favoritar'}
                                >
                                  <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                                </button>
                              </div>
                            </div>

                            {/* Detailed Accordion for Leaflet, Clinical Notes and Protocols */}
                            {isDetailOpen && (
                              <div className="p-3.5 rounded-xl bg-[#F5F9FD] dark:bg-slate-900 border border-[#DCE7F2] dark:border-slate-700/80 text-xs space-y-2 mt-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-[#14243A] dark:text-white flex items-center space-x-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-[#007F62] dark:text-[#00C896]" />
                                    <span>Bula e Orientações Clínicas ({prod.manufacturer})</span>
                                  </span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E5FFF4] text-[#007F62] dark:bg-emerald-950 dark:text-[#00C896] font-bold">
                                    STATUS: {prod.validationStatus || 'VALIDADO'}
                                  </span>
                                </div>
                                <p className="text-[#52677F] dark:text-slate-300 text-[11px] leading-relaxed">
                                  {prod.clinicalNotes}
                                </p>

                                {prod.protocols && prod.protocols.length > 0 && (
                                  <div className="pt-2 border-t border-[#DCE7F2] dark:border-slate-800">
                                    <h5 className="font-bold text-[11px] text-[#14243A] dark:text-slate-200 mb-1.5">
                                      Protocolos Posológicos Específicos de Bula:
                                    </h5>
                                    <div className="space-y-1">
                                      {prod.protocols.map((proto) => (
                                        <div
                                          key={proto.id}
                                          className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-[#DCE7F2] dark:border-slate-700 text-[11px]"
                                        >
                                          <span className="font-medium text-[#14243A] dark:text-slate-200">
                                            {proto.label}
                                          </span>
                                          <span className="font-mono text-[#007F62] dark:text-[#00C896] font-bold">
                                            {proto.doseMgKg.canino && `Cão: ${proto.doseMgKg.canino} mg/kg `}
                                            {proto.doseMgKg.felino && `Gato: ${proto.doseMgKg.felino} mg/kg`}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* =========================================================================
           VIEW 2: DIRECT CATALOG VIEW (Cards for all 541 commercial products)
           ========================================================================= */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <p className="text-xs font-bold text-[#52677F] dark:text-slate-400">
              Listando <span className="text-[#14243A] dark:text-white font-extrabold">{filteredProducts.length}</span> formulações comerciais registradas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredProducts.map((prod) => {
              const isFav = favoriteDrugs.includes(prod.id);

              return (
                <div
                  key={prod.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-[#DCE7F2] dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#00C896]/60 transition-all"
                >
                  <div className="space-y-2">
                    {/* Header: Form icon & Lab badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                        {prod.manufacturer || 'Laboratório Registrado'}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFavoriteDrug(prod.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isFav
                            ? 'border-amber-300 bg-amber-50 text-amber-500'
                            : 'border-[#DCE7F2] dark:border-slate-700 text-[#52677F]'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>

                    {/* Brand Name */}
                    <div className="flex items-center gap-3">
                      <ProductImage product={prod} size={64} />
                      <div className="min-w-0">
                      <h3 className="font-extrabold text-sm text-[#14243A] dark:text-white leading-snug">
                        {prod.brandName}
                      </h3>
                      <p className="text-xs text-[#52677F] dark:text-slate-400 mt-0.5">
                        Princípio ativo: <strong className="text-[#007F62] dark:text-[#00C896]">{prod.activePrinciple}</strong>
                      </p>
                      </div>
                    </div>

                    {/* Details Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prod.percentage !== undefined && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold">
                          {prod.percentage}% ({prod.concentrationMgMl} mg/mL)
                        </span>
                      )}
                      {prod.tabletMg !== undefined && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-[#007F62] dark:text-[#00C896] font-bold">
                          {prod.tabletMg} mg
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#52677F] dark:text-slate-300">
                        {prod.presentationText || prod.formType}
                      </span>
                    </div>

                    {/* Species & Route */}
                    <div className="text-[11px] text-[#52677F] dark:text-slate-400 space-y-0.5 pt-1 border-t border-[#DCE7F2] dark:border-slate-800">
                      <div>
                        Espécies: <strong className="text-[#14243A] dark:text-slate-200">{prod.species.join(', ')}</strong>
                      </div>
                      <div>
                        Via & Freq: <strong className="text-[#14243A] dark:text-slate-200">{prod.defaultRoute} • {prod.defaultFrequency}</strong>
                      </div>
                      <div className="text-[#007F62] dark:text-[#00C896] font-bold font-mono pt-1">
                        {prod.doseRangeText}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => openCalculatorWithCommercialProduct(prod)}
                    className="w-full py-2.5 rounded-xl bg-[#00C896] hover:bg-[#00B084] text-[#062C23] font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>CALCULAR DOSE</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

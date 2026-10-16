import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Receipt, 
  Plus, 
  Trash2, 
  Edit3, 
  Printer, 
  Search, 
  Check, 
  X, 
  Truck, 
  AlertTriangle,
  ArrowLeft,
  Flame,
  ShieldCheck,
  FileSpreadsheet,
  UploadCloud,
  FileText,
  CheckCircle,
  Navigation,
  Clock,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminPortal({ shopConfig, user, onConfigUpdated, onClose, initialTab = 'dashboard' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard'); // 'dashboard' | 'billing' | 'products' | 'orders' | 'users' | 'settings'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  if (!user?.is_admin) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(5, 5, 8, 0.98)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="glass-panel" style={{ maxWidth: 460, width: '100%', padding: 36, textAlign: 'center', border: '1px solid var(--border-violet)', boxShadow: '0 25px 60px rgba(0,0,0,0.85)' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <ShieldCheck size={28} color="#FFF" />
          </div>
          <h3 className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', marginBottom: 8 }}>
            Admin Access Restricted
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
            This console is reserved for store administrators. Sign in with authorized management credentials to access live stock, orders and configuration.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={async () => {
                await api.demoLogin('admin');
                window.location.reload();
              }}
              className="btn-prime"
              style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
            >
              👑 1-Click Demo Admin Login
            </button>
            <button
              onClick={onClose}
              className="btn-secondary-dark"
              style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState(null);

  // Products Data
  const [products, setProducts] = useState([]);
  const [productsSearch, setProductsSearch] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Product Form State
  const [prodForm, setProdForm] = useState({
    code: '',
    name: '',
    category: 'Sparklers',
    mrp: '',
    price: '',
    stock_quantity: 100,
    description: ''
  });

  // Orders Data
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [lrInput, setLrInput] = useState('');

  // Users Data
  const [usersList, setUsersList] = useState([]);

  // Shop Settings State
  const [settingsForm, setSettingsForm] = useState({
    shop_name: shopConfig?.shop_name || '',
    address: shopConfig?.address || '',
    whatsapp_number: shopConfig?.whatsapp_number || '',
    instagram_url: shopConfig?.instagram_url || '',
    facebook_url: shopConfig?.facebook_url || '',
    default_discount_percentage: shopConfig?.default_discount_percentage ?? 70
  });

  useEffect(() => {
    if (shopConfig) {
      setSettingsForm({
        shop_name: shopConfig.shop_name || '',
        address: shopConfig.address || '',
        whatsapp_number: shopConfig.whatsapp_number || '',
        instagram_url: shopConfig.instagram_url || '',
        facebook_url: shopConfig.facebook_url || '',
        default_discount_percentage: shopConfig.default_discount_percentage ?? 70
      });
    }
  }, [shopConfig]);

  // Fast Billing (POS) State
  const [posSearch, setPosSearch] = useState('');
  const [posResults, setPosResults] = useState([]);
  const [posCart, setPosCart] = useState([]);
  const [posDiscount, setPosDiscount] = useState(0);
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posCustomerPhone, setPosCustomerPhone] = useState('');
  const [posPaymentMethod, setPosPaymentMethod] = useState('cash');
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  // Voice Assistant for Billing State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState('');
  const [voiceError, setVoiceError] = useState('');

  // Bulk Upload State (CSV & PDF)
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUploading, setPdfUploading] = useState(false);

  // Live LR & Phone Tracking Console State
  const [adminTrackQuery, setAdminTrackQuery] = useState('');
  const [adminTrackResult, setAdminTrackResult] = useState(null);
  const [adminTrackLoading, setAdminTrackLoading] = useState(false);
  const [adminTrackError, setAdminTrackError] = useState('');

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Fetch Dashboard
  const loadDashboard = async () => {
    try {
      const data = await api.getAdminDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Products
  const loadProducts = async () => {
    try {
      const data = await api.getProducts({ search: productsSearch });
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Orders
  const loadOrders = async () => {
    try {
      const data = await api.getOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Users
  const loadUsers = async () => {
    try {
      const data = await api.getAdminUsers();
      setUsersList(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadProducts();
    loadOrders();
    loadUsers();
  }, []);

  // POS Search products & Load on Billing Tab
  useEffect(() => {
    if (activeTab === 'billing') {
      if (products.length === 0) {
        loadProducts();
      }
      const timer = setTimeout(async () => {
        try {
          const res = await api.searchBillingProducts(posSearch);
          if (res?.products) {
            setPosResults(res.products);
          }
        } catch (e) {
          console.error(e);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [posSearch, activeTab]);

  // Handle Product Create / Edit
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, prodForm);
        showToast('Product updated successfully!');
      } else {
        await api.createProduct(prodForm);
        showToast('Product added to catalog!');
      }
      setIsCreatingProduct(false);
      setEditingProduct(null);
      setProdForm({ name: '', category: 'Sparklers', mrp: '', price: '', stock_quantity: 100, description: '' });
      await loadProducts();
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      showToast('Product deleted');
      await loadProducts();
      await loadDashboard();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedProductIds.length} selected products?`)) return;
    try {
      await api.bulkDeleteProducts(selectedProductIds);
      setSelectedProductIds([]);
      showToast('Products deleted');
      await loadProducts();
      await loadDashboard();
    } catch (e) {
      alert(e.message);
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateAdminOrder(orderId, { status: newStatus });
      showToast(`Order #${orderId} marked as ${newStatus}`);
      await loadOrders();
      await loadDashboard();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleSaveLrNumber = async (orderId) => {
    try {
      await api.updateAdminOrder(orderId, { lr_number: lrInput });
      showToast('Transport LR number saved');
      await loadOrders();
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, lr_number: lrInput });
      }
      if (adminTrackResult && adminTrackResult.order_id === orderId) {
        setAdminTrackResult({ ...adminTrackResult, lr_number: lrInput });
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // Search Live Tracking in Admin
  const handleSearchAdminTrack = async (e) => {
    if (e) e.preventDefault();
    if (!adminTrackQuery.trim()) return;
    setAdminTrackLoading(true);
    setAdminTrackError('');
    try {
      const res = await api.trackOrder(adminTrackQuery.trim());
      setAdminTrackResult(res.tracking);
    } catch (err) {
      setAdminTrackError(err.message || 'No parcel record found matching this LR or phone number.');
      setAdminTrackResult(null);
    } finally {
      setAdminTrackLoading(false);
    }
  };

  // CSV Bulk Upload
  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return alert('Please choose a CSV file first');
    setCsvUploading(true);
    setCsvResult(null);
    try {
      const res = await api.importProductsCsv(csvFile);
      setCsvResult(res);
      showToast(res.message || 'CSV inventory uploaded successfully!');
      await loadProducts();
      await loadDashboard();
    } catch (err) {
      alert(err.message || 'Failed to import CSV');
    } finally {
      setCsvUploading(false);
    }
  };

  // PDF Pricelist Upload
  const handlePdfUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile) return alert('Please choose a PDF file first');
    setPdfUploading(true);
    try {
      const res = await api.uploadPricelistPdf(pdfFile);
      if (res.shop_config && onConfigUpdated) {
        onConfigUpdated(res.shop_config);
      }
      showToast('Official wholesale PDF price list uploaded successfully!');
    } catch (err) {
      alert(err.message || 'Failed to upload PDF');
    } finally {
      setPdfUploading(false);
    }
  };

  // Download Sample CSV template
  const downloadSampleCsv = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(
      'name,category,mrp,price,stock,description\n' +
      '10cm Electric Sparklers,Sparklers,160,48,250,Dazzling crackling gold sparklers direct from Sivakasi\n' +
      'Ground Chakkar Special,Chakkars,220,66,180,Spinning wheel of bright red and green sparks\n' +
      'Flower Pots Deluxe Big,Flower Pots,320,96,150,Tall golden shower fountain with silver stars\n' +
      '12 Shot Multi Color Cake,Aerial Cakes,800,240,90,12 sky-burst aerial shots with thunder crackle\n' +
      'VIP Sivakasi Family Hamper,Hampers,3500,1050,45,Complete 40-item festival mega combo box'
    );
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'sivakasi_crackers_sample_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.updateShopConfig(settingsForm);
      showToast('Shop configuration saved!');
      if (onConfigUpdated) onConfigUpdated(res.config);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Text to Speech
  const speak = (text) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    } catch (_e) {}
  };

  // POS Add to Cart with optional quantity
  const handlePosAddToCart = (prod, qty = 1) => {
    if (!prod) return;
    const addAmount = Math.max(1, parseInt(qty) || 1);
    const existing = posCart.find((i) => i.id === prod.id);
    if (existing) {
      setPosCart(posCart.map((i) => i.id === prod.id ? { ...i, quantity: i.quantity + addAmount } : i));
    } else {
      setPosCart([...posCart, { ...prod, quantity: addAmount }]);
    }
  };

  const handlePosUpdateQty = (prodId, qty) => {
    if (qty <= 0) {
      setPosCart(posCart.filter((i) => i.id !== prodId));
    } else {
      setPosCart(posCart.map((i) => i.id === prodId ? { ...i, quantity: qty } : i));
    }
  };

  // Keyboard Enter Quick-Add in POS Search
  const handlePosSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const q = posSearch.trim().toLowerCase();
      if (!q) return;

      const candidateList = posResults.length > 0 ? posResults : products;
      // Match exact code first, then exact ID, then first matching name
      const match = candidateList.find((p) => p.code?.toLowerCase() === q) ||
                    candidateList.find((p) => p.id?.toString() === q) ||
                    candidateList.find((p) => p.name?.toLowerCase().includes(q)) ||
                    candidateList[0];

      if (match) {
        handlePosAddToCart(match, 1);
        setPosSearch('');
        showToast(`Added ${match.name} (Code: ${match.code || match.id}) to bill`);
      }
    }
  };

  // Voice Assistant Logic
  const startVoiceBilling = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setVoiceError('Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError('');
        setVoiceFeedback('');
        setVoiceTranscript('Listening... Speak product code or name (e.g. "101" or "Add 5 sparklers")');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        processVoiceCommand(transcript);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setVoiceError(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceError(err.message || 'Microphone access failed.');
    }
  };

  const stopVoiceBilling = () => {
    setIsListening(false);
    setVoiceTranscript('');
  };

  const processVoiceCommand = (rawText) => {
    if (!rawText) return;
    const text = rawText.toLowerCase().trim();
    setVoiceTranscript(`Heard: "${rawText}"`);
    setVoiceError('');

    // Check for "clear bill"
    if (text.includes('clear') || text.includes('reset bill') || text.includes('new bill')) {
      setPosCart([]);
      setVoiceFeedback('🗑️ Cleared active bill');
      speak('Bill cleared');
      return;
    }

    // Parse quantity (default 1)
    let qty = 1;
    const wordNums = {
      'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
      'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
      'fifteen': 15, 'twenty': 20, 'fifty': 50, 'hundred': 100
    };

    const qtyMatch = text.match(/\b(\d+)\b/);
    if (qtyMatch) {
      qty = parseInt(qtyMatch[1], 10);
    } else {
      for (const [w, n] of Object.entries(wordNums)) {
        if (text.includes(w)) {
          qty = n;
          break;
        }
      }
    }

    const isRemove = text.includes('remove') || text.includes('delete') || text.includes('cancel');

    // Candidate products pool
    const pool = products.length > 0 ? products : posResults;
    if (pool.length === 0) {
      setVoiceError('Products catalog is still loading, please try in a moment.');
      return;
    }

    // 1. Check for product code match
    const words = text.split(/\s+/);
    let matched = null;

    for (const w of words) {
      const cleanW = w.replace(/[^a-z0-9]/gi, '');
      if (cleanW) {
        matched = pool.find((p) => p.code?.toLowerCase() === cleanW.toLowerCase() || p.id?.toString() === cleanW);
        if (matched) break;
      }
    }

    // 2. Search by cleaned voice text
    if (!matched) {
      const cleanName = text
        .replace(/\b(add|put|insert|please|give|box|boxes|carton|cartons|packet|packets|pcs|quantity|qty|code|item|remove|delete)\b/gi, ' ')
        .replace(/\b\d+\b/g, ' ')
        .trim();

      if (cleanName) {
        matched = pool.find((p) => p.name?.toLowerCase().includes(cleanName)) ||
                  pool.find((p) => p.category?.toLowerCase().includes(cleanName));
      }
    }

    if (matched) {
      if (isRemove) {
        handlePosUpdateQty(matched.id, 0);
        setVoiceFeedback(`❌ Removed ${matched.name} (Code: ${matched.code || matched.id})`);
        speak(`Removed ${matched.name}`);
      } else {
        handlePosAddToCart(matched, qty);
        setVoiceFeedback(`✅ Added ${qty}x ${matched.name} (Code: ${matched.code || matched.id})`);
        speak(`Added ${qty} ${matched.name}`);
      }
    } else {
      setVoiceError(`Could not find cracker for "${rawText}". Try saying product code like "101" or name like "Sparklers".`);
      speak('Cracker not found');
    }
  };

  const posSubtotal = posCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const posDiscountAmount = posSubtotal * (Number(posDiscount) / 100);
  const posTotalPayable = Math.max(0, posSubtotal - posDiscountAmount);

  // POS Checkout
  const handlePosCheckout = async () => {
    if (posCart.length === 0) return alert('No items in bill');
    setLoading(true);
    try {
      const res = await api.checkoutBilling({
        customer_name: posCustomerName || 'Walk-in Counter Customer',
        customer_phone: posCustomerPhone || 'Walk-in',
        payment_method: posPaymentMethod,
        discount_percentage: Number(posDiscount),
        items: posCart.map((i) => ({ id: i.id, quantity: i.quantity }))
      });

      setGeneratedInvoice(res.invoice);
      setPosCart([]);
      setPosCustomerName('');
      setPosCustomerPhone('');
      await loadProducts();
      await loadDashboard();
      await loadOrders();
    } catch (e) {
      alert(e.message || 'Billing checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1200, background: '#050508', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{ height: 64, background: 'rgba(12, 10, 20, 0.98)', borderBottom: '1px solid var(--border-violet)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={onClose}
            className="btn-secondary-dark"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Store</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color="#FFF" />
            </div>
            <div>
              <span className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>
                RAKSH ADMIN COMMAND CONSOLE
              </span>
              <span style={{ fontSize: '0.72rem', color: '#10B981', marginLeft: 8, fontWeight: 700 }}>
                ● ONLINE (SIVAKASI)
              </span>
            </div>
          </div>
        </div>

        {/* Global Toast */}
        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#34D399', padding: '6px 14px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600 }}>
            ✓ {successMsg}
          </div>
        )}
      </header>

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar Navigation */}
        <nav aria-label="Admin Navigation" style={{ width: 240, background: 'rgba(8, 7, 14, 0.98)', borderRight: '1px solid var(--border-subtle)', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'billing', label: 'Fast Billing (POS)', icon: Receipt, badge: 'Counter' },
            { id: 'products', label: 'Cracker Products', icon: Package, badge: products.length },
            { id: 'orders', label: 'Orders & Tracking', icon: ShoppingCart, badge: orders.length },
            { id: 'bulk_upload', label: 'Upload CSV & PDF', icon: FileSpreadsheet, badge: 'Bulk' },
            { id: 'users', label: 'Customers', icon: Users, badge: usersList.length },
            { id: 'settings', label: 'Store Settings', icon: Settings }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? 'rgba(168, 85, 247, 0.16)' : 'transparent',
                  color: isActive ? 'var(--violet-bright)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={18} color={isActive ? 'var(--violet-bright)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.9rem' }}>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span style={{ 
                    fontSize: '0.72rem', 
                    padding: '2px 7px', 
                    borderRadius: 9999, 
                    background: isActive ? 'var(--violet-gradient)' : 'rgba(255,255,255,0.08)',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                    fontWeight: 800
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && dashboardData && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
                    Store Analytics Overview
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Real-time revenue, inventory health & order velocity
                  </span>
                </div>
              </div>

              {/* KPI Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16, marginBottom: 32 }}>
                {[
                  { label: 'Total Sales Revenue', val: `₹${dashboardData.metrics.total_revenue}`, color: 'var(--violet-bright)' },
                  { label: 'Total Orders', val: dashboardData.metrics.total_orders, color: '#38BDF8' },
                  { label: 'Pending Shipments', val: dashboardData.metrics.pending_orders, color: 'var(--violet-light)' },
                  { label: 'Total Cracker Catalog', val: dashboardData.metrics.total_products, color: '#34D399' },
                  { label: 'Registered Customers', val: dashboardData.metrics.total_users, color: '#C084FC' }
                ].map((kpi, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '20px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                      {kpi.label}
                    </div>
                    <div className="font-heading" style={{ fontSize: '1.8rem', fontWeight: 800, color: kpi.color, marginTop: 6 }}>
                      {kpi.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Low Stock Alerts */}
              {dashboardData.low_stock_products?.length > 0 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 14, padding: '20px', marginBottom: 30 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: '#F87171' }}>
                    <AlertTriangle size={20} />
                    <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>Low Inventory Alert ({dashboardData.low_stock_products.length} products need replenishment)</h4>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                    {dashboardData.low_stock_products.map((p) => (
                      <div key={p.id} style={{ background: 'rgba(7, 7, 13, 0.6)', padding: '10px 14px', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#FFF', fontSize: '0.85rem', fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.category}</div>
                        </div>
                        <span style={{ padding: '3px 8px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', borderRadius: 6, color: '#F87171', fontSize: '0.78rem', fontWeight: 700 }}>
                          {p.stock_quantity} left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Orders Table */}
              <div className="glass-card" style={{ padding: 20 }}>
                <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: 16 }}>
                  Recent Orders Stream
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px 12px' }}>Order ID</th>
                        <th style={{ padding: '10px 12px' }}>Customer</th>
                        <th style={{ padding: '10px 12px' }}>Items</th>
                        <th style={{ padding: '10px 12px' }}>Amount</th>
                        <th style={{ padding: '10px 12px' }}>Status</th>
                        <th style={{ padding: '10px 12px' }}>Date</th>
                        <th style={{ padding: '10px 12px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recent_orders?.map((ord) => (
                        <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: 'var(--violet-bright)' }}>#{ord.id}</td>
                          <td style={{ padding: '12px', color: '#FFF' }}>{ord.customer_name}</td>
                          <td style={{ padding: '12px' }}>{ord.items_count} pcs</td>
                          <td style={{ padding: '12px', fontWeight: 700 }}>₹{ord.total_amount}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ 
                              padding: '2px 8px', 
                              borderRadius: 9999, 
                              fontSize: '0.72rem', 
                              fontWeight: 700,
                              background: ord.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                              color: ord.status === 'completed' ? '#34D399' : 'var(--violet-light)'
                            }}>
                              {ord.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{ord.created_at}</td>
                          <td style={{ padding: '12px' }}>
                            {ord.status !== 'completed' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                                style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34D399', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                              >
                                Mark Completed
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FAST BILLING (POS COUNTER) */}
          {activeTab === 'billing' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
                    Fast Counter Billing (POS)
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Instant product barcode search, custom wholesale bill discount & one-click invoice printing
                  </span>
                </div>
              </div>

              {/* Voice Billing Console Banner */}
              <div style={{
                background: isListening 
                  ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)' 
                  : 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(12, 10, 20, 0.95) 100%)',
                border: isListening ? '1px solid #F43F5E' : '1px solid var(--border-violet)',
                borderRadius: 14,
                padding: '14px 18px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 14,
                boxShadow: isListening ? '0 0 25px rgba(244, 63, 94, 0.35)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <button
                    type="button"
                    onClick={isListening ? stopVoiceBilling : startVoiceBilling}
                    style={{
                      background: isListening ? 'linear-gradient(135deg, #F43F5E, #E11D48)' : 'linear-gradient(135deg, #A855F7, #7E22CE)',
                      border: 'none',
                      borderRadius: 10,
                      padding: '10px 18px',
                      color: '#FFF',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      boxShadow: isListening ? '0 0 15px rgba(244, 63, 94, 0.6)' : '0 0 15px rgba(168, 85, 247, 0.4)'
                    }}
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    <span>{isListening ? 'Listening... Click to Stop' : '🎤 Voice Billing (Click & Speak)'}</span>
                  </button>

                  <div>
                    <div style={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 600 }}>
                      {voiceTranscript || 'Say product code (e.g. "101") or name (e.g. "Add 5 flower pots") to instantly add to bill'}
                    </div>
                    {voiceFeedback && (
                      <div style={{ color: '#34D399', fontSize: '0.82rem', fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Volume2 size={14} />
                        <span>{voiceFeedback}</span>
                      </div>
                    )}
                    {voiceError && (
                      <div style={{ color: '#FB7185', fontSize: '0.82rem', fontWeight: 600, marginTop: 2 }}>
                        ⚠️ {voiceError}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                    Say: <strong>"101"</strong> or <strong>"Add 5 of 102"</strong>
                  </span>
                  <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
                    Say: <strong>"Clear bill"</strong>
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
                {/* Product Search & Catalog List */}
                <div className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', marginBottom: 14, display: 'flex', gap: 10 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        placeholder="Type Code (e.g. 101) or Name & press Enter to add..."
                        value={posSearch}
                        onChange={(e) => setPosSearch(e.target.value)}
                        onKeyDown={handlePosSearchKeyDown}
                        className="input-prime"
                        style={{ paddingLeft: 40 }}
                        autoFocus
                      />
                    </div>
                    {posSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          const candidateList = posResults.length > 0 ? posResults : products;
                          const q = posSearch.trim().toLowerCase();
                          const match = candidateList.find(p => p.code?.toLowerCase() === q) ||
                                        candidateList.find(p => p.id?.toString() === q) ||
                                        candidateList.find(p => p.name?.toLowerCase().includes(q)) ||
                                        candidateList[0];
                          if (match) {
                            handlePosAddToCart(match, 1);
                            setPosSearch('');
                            showToast(`Added ${match.name} (Code: ${match.code || match.id}) to bill`);
                          }
                        }}
                        className="btn-prime"
                        style={{ padding: '0 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                      >
                        + Add to Bill
                      </button>
                    )}
                  </div>

                  <div style={{ flex: 1, maxHeight: 520, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {((posSearch.trim() ? posResults : (posResults.length > 0 ? posResults : products)).length === 0) ? (
                      <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                        No product matching "{posSearch}". You can speak via voice button or press Enter.
                      </div>
                    ) : (
                      (posSearch.trim() ? posResults : (posResults.length > 0 ? posResults : products)).map((p) => (
                        <div 
                          key={p.id}
                          onClick={() => handlePosAddToCart(p, 1)}
                          style={{
                            padding: '12px 14px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: 6,
                              fontSize: '0.85rem',
                              fontWeight: 800,
                              fontFamily: 'monospace',
                              background: 'rgba(168, 85, 247, 0.18)',
                              color: 'var(--violet-bright)',
                              border: '1px solid var(--border-violet)',
                              minWidth: 46,
                              textAlign: 'center'
                            }}>
                              {p.code || `#${p.id}`}
                            </span>
                            <div>
                              <div style={{ color: '#FFF', fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {p.category} • Stock: <span style={{ color: p.stock_quantity > 0 ? '#34D399' : '#F87171' }}>{p.stock_quantity} left</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--violet-bright)', fontSize: '1rem' }}>₹{p.price}</div>
                              {p.mrp > p.price && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{p.mrp}</div>
                              )}
                            </div>
                            <span style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(168, 85, 247, 0.15)', color: 'var(--violet-light)', fontSize: '0.8rem', fontWeight: 700 }}>
                              + Add
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Bill Cart & Customer Details */}
                <div className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF' }}>
                      Active Bill ({posCart.length} items)
                    </h3>
                    {posCart.length > 0 && (
                      <button
                        onClick={() => setPosCart([])}
                        style={{ background: 'none', border: 'none', color: '#F87171', fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Clear Bill
                      </button>
                    )}
                  </div>

                  {/* Customer Quick Inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={posCustomerName}
                      onChange={(e) => setPosCustomerName(e.target.value)}
                      className="input-prime"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <input
                      type="text"
                      placeholder="Mobile Phone"
                      value={posCustomerPhone}
                      onChange={(e) => setPosCustomerPhone(e.target.value)}
                      className="input-prime"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* Bill Items */}
                  <div style={{ flex: 1, minHeight: 220, maxHeight: 300, overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 8, marginBottom: 16 }}>
                    {posCart.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Click products on left to add to bill
                      </div>
                    ) : (
                      posCart.map((item) => (
                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                          <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                            <div style={{ color: '#FFF', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>₹{item.price} each</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handlePosUpdateQty(item.id, parseInt(e.target.value) || 0)}
                              style={{ width: 44, padding: '4px', textAlign: 'center', background: '#050508', border: '1px solid var(--border-subtle)', color: '#FFF', borderRadius: 4 }}
                            />
                            <span style={{ width: 60, textAlign: 'right', fontWeight: 700, color: 'var(--violet-bright)' }}>
                              ₹{item.price * item.quantity}
                            </span>
                            <button
                              onClick={() => handlePosUpdateQty(item.id, 0)}
                              style={{ background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', padding: 2 }}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Calculation & Payment Area */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.88rem', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Gross Subtotal:</span>
                      <span style={{ fontWeight: 700, color: '#FFF' }}>₹{posSubtotal}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Additional Bill Discount %:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={posDiscount}
                        onChange={(e) => setPosDiscount(e.target.value)}
                        style={{ width: 70, padding: '4px 8px', textAlign: 'right', background: '#050508', border: '1px solid var(--border-violet)', color: 'var(--violet-bright)', borderRadius: 6, fontWeight: 700 }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Payment Mode:</span>
                      <select
                        value={posPaymentMethod}
                        onChange={(e) => setPosPaymentMethod(e.target.value)}
                        style={{ background: '#050508', border: '1px solid var(--border-subtle)', color: '#FFF', padding: '6px 10px', borderRadius: 6, fontSize: '0.85rem' }}
                      >
                        <option value="cash">Cash Counter</option>
                        <option value="upi">UPI / GPay / PhonePe</option>
                        <option value="card">Card POS</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-violet)' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>Net Amount:</span>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--violet-bright)' }}>₹{Math.round(posTotalPayable)}</span>
                    </div>

                    <button
                      onClick={handlePosCheckout}
                      disabled={posCart.length === 0 || loading}
                      className="btn-prime"
                      style={{ width: '100%', padding: '14px', marginTop: 8, fontSize: '1rem', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#FFF' }}
                    >
                      <Printer size={18} />
                      <span>{loading ? 'Processing...' : 'Complete Order & Print Invoice'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Printable Invoice Modal (if generated) */}
              {generatedInvoice && (
                <div className="modal-overlay" onClick={() => setGeneratedInvoice(null)}>
                  <div className="modal-content-prime" style={{ maxWidth: 520, padding: 24 }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ textAlign: 'center', borderBottom: '1px dashed #666', paddingBottom: 14, marginBottom: 14 }}>
                      <h3 style={{ color: '#FFF', fontWeight: 800, fontSize: '1.3rem' }}>{generatedInvoice.shop_name}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sivakasi Direct Fireworks Wholesale Counter</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Order #{generatedInvoice.order_id} • {generatedInvoice.date}</div>
                    </div>

                    <div style={{ fontSize: '0.85rem', marginBottom: 12 }}>
                      <div>Customer: <strong style={{ color: '#FFF' }}>{generatedInvoice.customer_name}</strong></div>
                      <div>Phone: {generatedInvoice.customer_phone}</div>
                      <div>Payment: {generatedInvoice.payment_method}</div>
                    </div>

                    <div style={{ borderTop: '1px dashed #666', borderBottom: '1px dashed #666', padding: '10px 0', marginBottom: 12, fontSize: '0.85rem' }}>
                      {generatedInvoice.items?.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span>{it.name} × {it.quantity}</span>
                          <span style={{ fontWeight: 600 }}>₹{it.subtotal}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--violet-bright)', marginBottom: 20 }}>
                      <span>Total Paid:</span>
                      <span>₹{generatedInvoice.total_amount}</span>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => window.print()} className="btn-prime" style={{ flex: 1, padding: 10 }}>
                        <Printer size={16} /> Print Receipt
                      </button>
                      <button onClick={() => setGeneratedInvoice(null)} className="btn-secondary-dark" style={{ flex: 1, padding: 10 }}>
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS INVENTORY */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
                    Cracker Catalog Management ({products.length})
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Add new Sivakasi fireworks, edit stock levels and manage wholesale prices
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {selectedProductIds.length > 0 && (
                    <button onClick={handleBulkDelete} className="btn-fire" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                      <Trash2 size={15} /> Delete Selected ({selectedProductIds.length})
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setEditingProduct(null);
                      setProdForm({ name: '', category: 'Sparklers', mrp: '', price: '', stock_quantity: 100, description: '' });
                      setIsCreatingProduct(true);
                    }} 
                    className="btn-prime" 
                    style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                  >
                    <Plus size={16} /> Add New Cracker
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="glass-card" style={{ padding: 20 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                        <th style={{ padding: '10px 12px', width: 40 }}>
                          <input 
                            type="checkbox" 
                            checked={selectedProductIds.length === products.length && products.length > 0}
                            onChange={(e) => setSelectedProductIds(e.target.checked ? products.map(p => p.id) : [])}
                          />
                        </th>
                        <th style={{ padding: '10px 12px', width: 90 }}>Code</th>
                        <th style={{ padding: '10px 12px' }}>Product</th>
                        <th style={{ padding: '10px 12px' }}>Category</th>
                        <th style={{ padding: '10px 12px' }}>MRP</th>
                        <th style={{ padding: '10px 12px' }}>Wholesale Price</th>
                        <th style={{ padding: '10px 12px' }}>Stock</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => {
                        const isSelected = selectedProductIds.includes(p.id);
                        return (
                          <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: isSelected ? 'rgba(245, 158, 11, 0.05)' : 'transparent' }}>
                            <td style={{ padding: '12px' }}>
                              <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  setSelectedProductIds(e.target.checked ? [...selectedProductIds, p.id] : selectedProductIds.filter(id => id !== p.id));
                                }}
                              />
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ 
                                fontFamily: 'monospace', 
                                fontWeight: 700, 
                                color: 'var(--violet-bright)', 
                                background: 'rgba(168,85,247,0.15)', 
                                padding: '3px 8px', 
                                borderRadius: 4, 
                                border: '1px solid var(--border-violet)', 
                                fontSize: '0.82rem' 
                              }}>
                                {p.code || `#${p.id}`}
                              </span>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ color: '#FFF', fontWeight: 600 }}>{p.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{p.id}</div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span className="badge-violet">{p.category}</span>
                            </td>
                            <td style={{ padding: '12px', color: 'var(--text-muted)' }}>₹{p.mrp}</td>
                            <td style={{ padding: '12px', fontWeight: 700, color: 'var(--violet-bright)' }}>₹{p.price}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ color: p.stock_quantity > 15 ? '#34D399' : '#F87171', fontWeight: 700 }}>
                                {p.stock_quantity}
                              </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                                <button
                                  onClick={() => {
                                    setEditingProduct(p);
                                    setProdForm({
                                      name: p.name,
                                      category: p.category,
                                      mrp: p.mrp,
                                      price: p.price,
                                      stock_quantity: p.stock_quantity,
                                      description: p.description || ''
                                    });
                                    setIsCreatingProduct(true);
                                  }}
                                  className="btn-secondary-dark"
                                  style={{ padding: '4px 8px' }}
                                  title="Edit"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="btn-secondary-dark"
                                  style={{ padding: '4px 8px', color: '#F87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Product Modal */}
              {isCreatingProduct && (
                <div className="modal-overlay" onClick={() => setIsCreatingProduct(false)}>
                  <div className="modal-content-prime" style={{ maxWidth: 540, padding: 24 }} onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-heading" style={{ color: '#FFF', fontWeight: 800, fontSize: '1.3rem', marginBottom: 16 }}>
                      {editingProduct ? 'Edit Cracker Product' : 'Add New Cracker to Catalog'}
                    </h3>

                    <form onSubmit={handleSaveProduct}>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 14 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                            Product Code
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 101"
                            value={prodForm.code}
                            onChange={(e) => setProdForm({ ...prodForm, code: e.target.value })}
                            className="input-prime"
                            style={{ fontFamily: 'monospace', fontWeight: 700 }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                            Product Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={prodForm.name}
                            onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                            className="input-prime"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                            Category *
                          </label>
                          <select
                            value={prodForm.category}
                            onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                            className="input-prime"
                          >
                            {['Sparklers', 'Ground Chakkars', 'Flower Pots', 'Rockets', 'Sky Shots', 'Sound Crackers', 'Gift Boxes'].map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                            Stock Quantity *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={prodForm.stock_quantity}
                            onChange={(e) => setProdForm({ ...prodForm, stock_quantity: parseInt(e.target.value) || 0 })}
                            className="input-prime"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                            Retail MRP (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            value={prodForm.mrp}
                            onChange={(e) => {
                              const mrp = parseFloat(e.target.value) || 0;
                              const disc = Number(shopConfig?.default_discount_percentage || 70);
                              const autoPrice = (mrp * (1 - disc / 100)).toFixed(0);
                              setProdForm({ ...prodForm, mrp: e.target.value, price: autoPrice });
                            }}
                            className="input-prime"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                            Selling Wholesale Price (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            value={prodForm.price}
                            onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                            className="input-prime"
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                          Description / Safety Notes
                        </label>
                        <textarea
                          rows={2}
                          value={prodForm.description}
                          onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                          className="input-prime"
                        />
                      </div>

                      <div style={{ display: 'flex', gap: 10 }}>
                        <button type="submit" className="btn-prime" style={{ flex: 1, padding: 12 }}>
                          {editingProduct ? 'Update Product' : 'Create Product'}
                        </button>
                        <button type="button" onClick={() => setIsCreatingProduct(false)} className="btn-secondary-dark" style={{ flex: 1, padding: 12 }}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ORDERS & LR TRACKING */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
                    Customer Orders & Transport Logistics
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Manage customer shipments, update fulfillment status & assign Sivakasi Transport LR copies
                  </span>
                </div>
              </div>

              {/* LIVE LR & PHONE NUMBER TRACKING CONSOLE */}
              <div className="glass-card" style={{ padding: 20, marginBottom: 24, border: '1px solid var(--border-violet)', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(12, 10, 20, 0.95) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Truck size={20} color="var(--violet-bright)" />
                  <h3 className="font-heading" style={{ fontSize: '1.15rem', color: '#FFF', fontWeight: 700 }}>
                    Live LR & Phone Number Parcel Tracking System
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                  Search any consignment instantly by Sivakasi Transport LR copy number (e.g. ST-89241-MDU) or 10-digit customer phone number.
                </p>

                <form onSubmit={handleSearchAdminTrack} style={{ display: 'flex', gap: 10, maxWidth: 650, marginBottom: 16 }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Enter LR Number or Customer Phone (e.g. ST-89241 or 98421)..."
                      value={adminTrackQuery}
                      onChange={(e) => setAdminTrackQuery(e.target.value)}
                      className="input-prime"
                      style={{ paddingLeft: 38, height: 42, fontSize: '0.88rem' }}
                    />
                  </div>
                  <button type="submit" disabled={adminTrackLoading} className="btn-prime" style={{ padding: '0 20px', height: 42, fontSize: '0.88rem' }}>
                    {adminTrackLoading ? 'Searching...' : 'Track Live Status'}
                  </button>
                  {adminTrackResult && (
                    <button type="button" onClick={() => { setAdminTrackResult(null); setAdminTrackQuery(''); }} className="btn-secondary-dark" style={{ height: 42, padding: '0 14px' }}>
                      Clear
                    </button>
                  )}
                </form>

                {adminTrackError && (
                  <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#FCA5A5', borderRadius: 8, fontSize: '0.85rem' }}>
                    {adminTrackError}
                  </div>
                )}

                {adminTrackResult && (
                  <div style={{ background: 'rgba(5, 5, 8, 0.85)', border: '1px solid var(--border-violet)', borderRadius: 12, padding: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14, marginBottom: 16 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>
                            Order #{adminTrackResult.order_id}
                          </span>
                          <span className="badge-violet" style={{ fontSize: '0.78rem' }}>
                            {adminTrackResult.current_status}
                          </span>
                          <span className="badge-emerald" style={{ fontSize: '0.78rem' }}>
                            {adminTrackResult.transport_agency}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                          Customer: <strong style={{ color: '#FFF' }}>{adminTrackResult.customer_name}</strong> ({adminTrackResult.customer_phone}) • To: <strong style={{ color: '#FFF' }}>{adminTrackResult.destination_city}</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned LR Number:</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--violet-bright)' }}>
                          {adminTrackResult.lr_number || 'Not yet assigned'}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedOrder({ id: adminTrackResult.order_id, customer_name: adminTrackResult.customer_name });
                            setLrInput(adminTrackResult.lr_number || '');
                          }}
                          className="btn-outline-violet"
                          style={{ padding: '3px 10px', fontSize: '0.75rem', marginTop: 4 }}
                        >
                          Update LR
                        </button>
                      </div>
                    </div>

                    {/* 5-Stage Live Timeline */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginTop: 14 }}>
                      {adminTrackResult.timeline && adminTrackResult.timeline.map((step, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '10px 12px',
                            borderRadius: 8,
                            background: step.completed ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                            border: `1px solid ${step.completed ? 'var(--violet-primary)' : 'rgba(255, 255, 255, 0.08)'}`
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            {step.completed ? (
                              <CheckCircle size={14} color="#34D399" />
                            ) : (
                              <Clock size={14} color="var(--text-muted)" />
                            )}
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: step.completed ? '#FFF' : 'var(--text-muted)' }}>
                              {step.stage}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                            {step.location}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {step.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-card" style={{ padding: 20 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '10px 12px' }}>Order ID</th>
                        <th style={{ padding: '10px 12px' }}>Customer</th>
                        <th style={{ padding: '10px 12px' }}>WhatsApp Phone</th>
                        <th style={{ padding: '10px 12px' }}>Total Amount</th>
                        <th style={{ padding: '10px 12px' }}>Transport LR No.</th>
                        <th style={{ padding: '10px 12px' }}>Status</th>
                        <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: 'var(--violet-bright)' }}>#{ord.id}</td>
                          <td style={{ padding: '12px', color: '#FFF' }}>{ord.customer_name}</td>
                          <td style={{ padding: '12px' }}>{ord.customer_phone}</td>
                          <td style={{ padding: '12px', fontWeight: 700 }}>₹{ord.total_amount}</td>
                          <td style={{ padding: '12px' }}>
                            {ord.lr_number ? (
                              <span style={{ color: '#60A5FA', fontWeight: 700 }}>{ord.lr_number}</span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not assigned</span>
                            )}
                          </td>
                          <td style={{ padding: '12px' }}>
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              style={{
                                background: ord.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                                color: ord.status === 'completed' ? '#34D399' : 'var(--violet-light)',
                                border: '1px solid currentColor',
                                padding: '4px 8px',
                                borderRadius: 6,
                                fontSize: '0.78rem',
                                fontWeight: 700
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setLrInput(ord.lr_number || '');
                              }}
                              className="btn-outline-violet"
                              style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                            >
                              <Truck size={14} /> Assign LR
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* LR Modal */}
              {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                  <div className="modal-content-prime" style={{ maxWidth: 440, padding: 24 }} onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-heading" style={{ color: '#FFF', fontWeight: 800, fontSize: '1.25rem', marginBottom: 12 }}>
                      Assign Transport LR Number for Order #{selectedOrder.id}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                      Enter the Sivakasi Transport Lorry Receipt (LR) tracking number provided by the transport agency (e.g. VRL-98421).
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. VRL-89421-SVK"
                      value={lrInput}
                      onChange={(e) => setLrInput(e.target.value)}
                      className="input-prime"
                      style={{ marginBottom: 20 }}
                    />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => { handleSaveLrNumber(selectedOrder.id); setSelectedOrder(null); }} className="btn-prime" style={{ flex: 1, padding: 12 }}>
                        Save LR Number
                      </button>
                      <button onClick={() => setSelectedOrder(null)} className="btn-secondary-dark" style={{ flex: 1, padding: 12 }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: BULK UPLOAD WITH SPREADSHEET (CSV) OR PDF */}
          {activeTab === 'bulk_upload' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
                    Bulk Upload & Price List Distribution
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Bulk update crackers stock & prices via CSV spreadsheets or publish official Sivakasi PDF pricelist catalogs
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
                {/* SECTION 1: SPREADSHEET (CSV) BULK PRODUCT IMPORT */}
                <div className="glass-card" style={{ padding: 24, border: '1px solid var(--border-violet)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(16, 185, 129, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileSpreadsheet size={20} color="#34D399" />
                    </div>
                    <div>
                      <h3 className="font-heading" style={{ fontSize: '1.15rem', color: '#FFF', fontWeight: 700 }}>
                        Upload Spreadsheet (CSV)
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Bulk import, add, or update crackers catalog & stock
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
                    Upload an Excel/CSV file to bulk update product prices, wholesale rates, stock levels, and descriptions. Existing items will be updated automatically by name.
                  </p>

                  <form onSubmit={handleCsvUpload}>
                    <div style={{
                      border: '2px dashed var(--border-violet)',
                      borderRadius: 12,
                      padding: '24px 16px',
                      textAlign: 'center',
                      background: 'rgba(5, 5, 8, 0.6)',
                      marginBottom: 16,
                      cursor: 'pointer'
                    }}>
                      <UploadCloud size={32} color="var(--violet-light)" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFF', marginBottom: 4 }}>
                        {csvFile ? csvFile.name : 'Select CSV Spreadsheet File'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                        {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : 'Supports .csv files exported from Excel, Sheets, or ERP'}
                      </div>
                      <input
                        type="file"
                        accept=".csv,text/csv"
                        onChange={(e) => setCsvFile(e.target.files[0] || null)}
                        style={{ display: 'none' }}
                        id="csv-file-input"
                      />
                      <label htmlFor="csv-file-input" className="btn-secondary-dark" style={{ display: 'inline-block', padding: '6px 16px', fontSize: '0.82rem', cursor: 'pointer' }}>
                        Browse Computer
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="submit"
                        disabled={!csvFile || csvUploading}
                        className="btn-prime"
                        style={{ flex: 1, padding: '10px 16px', fontSize: '0.88rem' }}
                      >
                        {csvUploading ? 'Importing Products...' : 'Upload & Sync Inventory'}
                      </button>
                      <button
                        type="button"
                        onClick={downloadSampleCsv}
                        className="btn-secondary-dark"
                        style={{ padding: '10px 14px', fontSize: '0.82rem', gap: 6 }}
                        title="Download sample CSV formatted for this shop"
                      >
                        <Download size={15} />
                        <span>Sample CSV</span>
                      </button>
                    </div>
                  </form>

                  {csvResult && (
                    <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', borderRadius: 8 }}>
                      <div style={{ fontWeight: 700, color: '#34D399', fontSize: '0.88rem' }}>
                        ✓ {csvResult.message}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                        Created: <strong>{csvResult.created_count}</strong> • Updated: <strong>{csvResult.updated_count}</strong> • Total in Catalog: <strong>{csvResult.total_count}</strong>
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <strong>Expected Columns:</strong> name, category, mrp, price, stock, description
                  </div>
                </div>

                {/* SECTION 2: OFFICIAL PDF PRICELIST UPLOAD */}
                <div className="glass-card" style={{ padding: 24, border: '1px solid var(--border-violet)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(239, 68, 68, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={20} color="#F87171" />
                    </div>
                    <div>
                      <h3 className="font-heading" style={{ fontSize: '1.15rem', color: '#FFF', fontWeight: 700 }}>
                        Upload PDF Price List
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Official printable Sivakasi rate card for customer downloads
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 18 }}>
                    Upload your official Sivakasi Diwali 2026 Wholesale Rate Card PDF. Customers on the shopping portal can download this exact PDF directly from the Price List page.
                  </p>

                  <form onSubmit={handlePdfUpload}>
                    <div style={{
                      border: '2px dashed var(--border-violet)',
                      borderRadius: 12,
                      padding: '24px 16px',
                      textAlign: 'center',
                      background: 'rgba(5, 5, 8, 0.6)',
                      marginBottom: 16,
                      cursor: 'pointer'
                    }}>
                      <UploadCloud size={32} color="#F87171" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#FFF', marginBottom: 4 }}>
                        {pdfFile ? pdfFile.name : 'Select Official PDF Price List'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                        {pdfFile ? `${(pdfFile.size / 1024).toFixed(1)} KB` : 'Supports standard .pdf documents'}
                      </div>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => setPdfFile(e.target.files[0] || null)}
                        style={{ display: 'none' }}
                        id="pdf-file-input"
                      />
                      <label htmlFor="pdf-file-input" className="btn-secondary-dark" style={{ display: 'inline-block', padding: '6px 16px', fontSize: '0.82rem', cursor: 'pointer' }}>
                        Browse Computer
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={!pdfFile || pdfUploading}
                      className="btn-prime"
                      style={{ width: '100%', padding: '10px 16px', fontSize: '0.88rem' }}
                    >
                      {pdfUploading ? 'Uploading PDF...' : 'Publish Official PDF Price List'}
                    </button>
                  </form>

                  {/* Current Active PDF Status */}
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF', marginBottom: 8 }}>
                      Current Published PDF Catalog:
                    </div>
                    {shopConfig?.pricelist_pdf_url ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(168, 85, 247, 0.12)', borderRadius: 8, border: '1px solid var(--border-violet)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--violet-bright)' }}>
                          <FileText size={16} />
                          <span>Active 2026 Price List PDF</span>
                        </div>
                        <a
                          href={shopConfig.pricelist_pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-outline-violet"
                          style={{ padding: '4px 10px', fontSize: '0.75rem', textDecoration: 'none' }}
                        >
                          View / Download
                        </a>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Auto-generated instant PDF is currently active. Upload a custom PDF above to override it with your branded catalog.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMER DIRECTORY */}
          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
                    Registered Customers & Accounts ({usersList.length})
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Customer accounts, order counts & total spent metrics
                  </span>
                </div>
              </div>

              <div className="glass-card" style={{ padding: 20 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px 12px' }}>Customer Email</th>
                      <th style={{ padding: '10px 12px' }}>Role</th>
                      <th style={{ padding: '10px 12px' }}>Account Status</th>
                      <th style={{ padding: '10px 12px' }}>Orders Placed</th>
                      <th style={{ padding: '10px 12px' }}>Total Spend</th>
                      <th style={{ padding: '10px 12px' }}>Joined Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px', fontWeight: 600, color: '#FFF' }}>{u.email}</td>
                        <td style={{ padding: '12px' }}>
                          <span className={u.is_admin ? 'badge-violet' : 'badge-emerald'}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#10B981', fontWeight: 600 }}>
                          Active Verified
                        </td>
                        <td style={{ padding: '12px' }}>{u.orders_count} orders</td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#34D399' }}>₹{u.total_spent}</td>
                        <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{u.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: 650 }}>
              <h2 className="font-heading" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF', marginBottom: 4 }}>
                Sivakasi Store Settings
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                Configure your store branding, WhatsApp floating concierge and default factory wholesale discount percentage
              </p>

              <div className="glass-card" style={{ padding: 24 }}>
                <form onSubmit={handleSaveSettings}>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Shop Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.shop_name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, shop_name: e.target.value })}
                      className="input-prime"
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Shop Address / Godown Location
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      placeholder="e.g. 123 Celebration Bypass Road, Sivakasi, Tamil Nadu - 626123"
                      className="input-prime"
                      style={{ height: 'auto', padding: '10px 14px', resize: 'vertical' }}
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                      Shown on website footer, order invoices and parcel receipts.
                    </small>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      WhatsApp Concierge Mobile (with country code)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98421 54321"
                      value={settingsForm.whatsapp_number}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                      className="input-prime"
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                      Used for customer floating chat button and SMS order confirmations.
                    </small>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      Default Factory Wholesale Discount (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={settingsForm.default_discount_percentage}
                      onChange={(e) => setSettingsForm({ ...settingsForm, default_discount_percentage: parseFloat(e.target.value) || 0 })}
                      className="input-prime"
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>
                      Auto-computes wholesale selling price from MRP when creating new products.
                    </small>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        Instagram Link
                      </label>
                      <input
                        type="url"
                        value={settingsForm.instagram_url}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagram_url: e.target.value })}
                        className="input-prime"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                        Facebook Link
                      </label>
                      <input
                        type="url"
                        value={settingsForm.facebook_url}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebook_url: e.target.value })}
                        className="input-prime"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-prime"
                    style={{ padding: '12px 28px', fontSize: '1rem' }}
                  >
                    {loading ? 'Saving...' : 'Save Configuration'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

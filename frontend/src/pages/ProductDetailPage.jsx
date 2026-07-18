// src/pages/ProductDetailPage.jsx
// Displays a single product detail view strictly loaded from the backend database
// Allows admins to edit the product specifications or delete it from database
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Plus, Minus, ChevronDown, Edit3, Trash2, Upload, X } from 'lucide-react';
import { addToCart as addToCartSlice } from '../store/cartSlice';
import { getProductSvg } from '../data/mockData';
import { getProductBySlug, updateProductAPI, deleteProductAPI } from '../services/api';
import Navbar from '../components/landing/Navbar';
import Popup from '../components/landing/Popup';

const spring = { type: 'spring', bounce: 0, duration: 0.3 };

function AccordionSection({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t-2 border-black">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 font-space font-bold text-xs md:text-sm uppercase tracking-wider text-black hover:text-neutral-500 transition-colors duration-75 touch-manipulation"
      >
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={spring}>
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={spring}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.role === 'admin';

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  // Edit form states
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editMrp, setEditMrp] = useState('');
  const [editSellingPrice, setEditSellingPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editDeliveryDays, setEditDeliveryDays] = useState('');
  const [editSku, setEditSku] = useState('');
  const [editTagsInput, setEditTagsInput] = useState('');
  const [editFeatures, setEditFeatures] = useState([]);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

  const fetchProductDetails = () => {
    setLoading(true);
    setErrorMsg('');
    getProductBySlug(slug)
      .then((res) => {
        const data = res.data?.data;
        if (data) {
          setProduct(data);
          // Initialize edit states
          setEditName(data.name || '');
          setEditDesc(data.description || '');
          setEditMrp(data.mrp || '');
          setEditSellingPrice(data.sellingPrice || '');
          setEditStock(data.stock || 0);
          setEditDeliveryDays(data.deliveryDays || 5);
          setEditSku(data.sku || '');
          setEditTagsInput(data.searchTags?.join(', ') || '');
          setEditFeatures(data.features || []);
        } else {
          setErrorMsg('PRODUCT NOT REGISTERED IN INVENTORY.');
        }
      })
      .catch((err) => {
        setErrorMsg(err?.response?.data?.message || 'ERROR CONNECTING TO PRODUCT DATABASE.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProductDetails();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCartSlice({ product, quantity: qty }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Submit Edit API
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!product) return;
    setSubmitting(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('name', editName);
    formData.append('description', editDesc);
    formData.append('mrp', editMrp);
    formData.append('sellingPrice', editSellingPrice);
    formData.append('category', product.category?._id || product.category); // unchangeable
    formData.append('stock', editStock);
    formData.append('deliveryDays', editDeliveryDays);
    formData.append('sku', editSku);

    // Tags
    const tagsArr = editTagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
    tagsArr.forEach(tag => formData.append('searchTags[]', tag));

    // Features
    const featuresArr = editFeatures.filter(f => f.key && f.value);
    formData.append('features', JSON.stringify(featuresArr));

    // Images
    for (let i = 0; i < editImageFiles.length; i++) {
      formData.append('images', editImageFiles[i]);
    }

    try {
      await updateProductAPI(product._id, formData);
      setEditOpen(false);
      fetchProductDetails();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'FAILED TO UPDATE PRODUCT DETAILS.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!product) return;
    setDeletePopupOpen(false);

    try {
      await deleteProductAPI(product._id);
      navigate('/categories');
    } catch (err) {
      alert(err?.response?.data?.message || 'FAILED TO REMOVE PRODUCT.');
    }
  };

  const addFeatureRow = () => setEditFeatures([...editFeatures, { key: '', value: '' }]);
  const updateFeatureRow = (idx, field, val) => {
    const updated = [...editFeatures];
    updated[idx] = { ...updated[idx], [field]: val };
    setEditFeatures(updated);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black font-space">
        <Navbar />
        <div className="pt-30 px-6 text-center text-xs uppercase tracking-widest text-neutral-400">
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}>■</motion.span>
          LOADING PRODUCT DETAILS...
        </div>
      </div>
    );
  }

  if (errorMsg && !editOpen && !product) {
    return (
      <div className="min-h-screen bg-white text-black font-space">
        <Navbar />
        <div className="pt-35 px-6 text-center">
          <h1 className="font-inter font-black text-3xl uppercase tracking-tighter text-neutral-300 mb-6">
            {errorMsg || 'PRODUCT NOT FOUND'}
          </h1>
          <Link to="/shop" className="border-2 border-black px-6 py-3 font-bold text-xs uppercase hover:bg-black hover:text-white transition-colors">
            RETURN TO SHOP
          </Link>
        </div>
      </div>
    );
  }

  const svgIcon = getProductSvg(product.slug, 0);
  const saving = product.mrp - product.sellingPrice;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 border-b-2 border-black px-4 md:px-12 py-2.5 font-space text-[10px] md:text-xs text-neutral-500 uppercase tracking-widest flex items-center gap-1.5 overflow-x-auto whitespace-nowrap bg-white">
        <Link to="/" className="hover:text-black transition-colors shrink-0">HOME</Link>
        <span className="shrink-0">/</span>
        <Link to="/categories" className="hover:text-black transition-colors shrink-0">{product.category?.name || 'CATEGORY'}</Link>
        <span className="shrink-0">/</span>
        <span className="text-black font-bold shrink-0 truncate max-w-d40">{product.name}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[58%_42%]">

        {/* ── IMAGE PANEL ── */}
        <div className="border-b-4 lg:border-b-0 lg:border-r-4 border-black bg-[#F5F5F5] flex flex-col">
          
          {/* Main canvas */}
          <div className="flex items-center justify-center bg-stripes-light border-b-2 border-black py-8 px-4 relative"
               style={{ minHeight: 'clamp(280px, 50vw, 520px)' }}>

            {/* Clean active poster box without double frame borders */}
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden group"
                 style={{ width: 'clamp(180px, 48vw, 320px)', aspectRatio: '3/4' }}>
              {product.images && product.images[activeThumb] ? (
                <img
                  src={product.images[activeThumb]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">{svgIcon}</div>
              )}
            </div>

            {/* Low-stock badge */}
            {product.stock <= 10 && (
              <div className="absolute bottom-3 left-3 bg-black text-white font-space text-[9px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 uppercase tracking-wider border-2 border-black z-10 shadow-[2px_2px_0_0_#fff]">
                {product.stock === 0 ? 'SOLD OUT' : `ONLY ${product.stock} LEFT`}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="grid grid-cols-4 bg-white border-b-2 md:border-b-0 border-black">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`aspect-square bg-stripes-light flex items-center justify-center border-r-2 border-black last:border-r-0 touch-manipulation transition-all cursor-pointer ${
                    activeThumb === i ? 'ring-4 ring-inset ring-black opacity-100' : 'opacity-40 hover:opacity-75'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))
            ) : (
              [0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`aspect-square bg-stripes-light flex items-center justify-center border-r-2 border-black last:border-r-0 touch-manipulation transition-all cursor-pointer ${
                    activeThumb === i ? 'ring-4 ring-inset ring-black opacity-100' : 'opacity-40 hover:opacity-75'
                  }`}
                >
                  <div className="w-6 h-6 md:w-8 md:h-8 opacity-50">{svgIcon}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── PRODUCT DETAILS (OR EDIT PANEL) ── */}
        <div className="flex flex-col px-4 pt-6 pb-28 md:pb-10 md:px-10 md:py-8 overflow-y-auto bg-white">
          
          {/* Category + SKU + Admin edit button */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-space text-[9px] md:text-xs font-bold uppercase tracking-widest border-2 border-black px-2 md:px-3 py-0.5 md:py-1 bg-black text-white">
              {product.category?.name || 'PRINT CATEGORY'}
            </span>
            <span className="font-space text-[9px] md:text-xs text-neutral-500 uppercase tracking-widest">
              {product.sku}
            </span>

            {/* Admin Toggle edit view */}
            {isAdmin && (
              <button
                onClick={() => { setEditOpen(!editOpen); setErrorMsg(''); }}
                className="border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors px-2.5 py-1 font-space font-bold text-[9px] uppercase tracking-wider ml-auto flex items-center gap-1 cursor-pointer touch-manipulation"
              >
                <Edit3 size={11} />
                <span>{editOpen ? 'CANCEL' : 'EDIT'}</span>
              </button>
            )}
          </div>

          {editOpen && isAdmin ? (
            /* ── ADMIN EDIT PRODUCT FORM ── */
            <form onSubmit={handleUpdateProduct} className="flex flex-col gap-5 font-space">
              <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                <h2 className="font-inter font-black text-xl uppercase tracking-tighter">🛠 EDIT PRODUCT SPECS</h2>
                <button
                  type="button"
                  onClick={() => setDeletePopupOpen(true)}
                  className="text-red-600 hover:text-white hover:bg-red-600 transition-colors p-1.5 border border-red-600 flex items-center gap-1 font-bold text-[9px]"
                >
                  <Trash2 size={11} /> DELETE
                </button>
              </div>

              {errorMsg && (
                <div className="border-2 border-black bg-black text-white text-[10px] font-bold uppercase px-3 py-2">
                  ⚠ {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-widest">PRODUCT NAME</label>
                <input
                  type="text" required value={editName} onChange={(e) => setEditName(e.target.value)}
                  style={{ fontSize: '16px' }} className="w-full bg-white border-2 border-black px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-widest">DESCRIPTION</label>
                <textarea
                  required value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                  rows={3} style={{ fontSize: '16px' }} className="w-full bg-white border-2 border-black px-3 py-2 text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest">MRP (INR)</label>
                  <input
                    type="number" required value={editMrp} onChange={(e) => setEditMrp(e.target.value)}
                    style={{ fontSize: '16px' }} className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest">SELLING PRICE</label>
                  <input
                    type="number" required value={editSellingPrice} onChange={(e) => setEditSellingPrice(e.target.value)}
                    style={{ fontSize: '16px' }} className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest">STOCK COUNT</label>
                  <input
                    type="number" required value={editStock} onChange={(e) => setEditStock(e.target.value)}
                    style={{ fontSize: '16px' }} className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest">DELIVERY DAYS</label>
                  <input
                    type="number" required value={editDeliveryDays} onChange={(e) => setEditDeliveryDays(e.target.value)}
                    style={{ fontSize: '16px' }} className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest">SKU</label>
                  <input
                    type="text" value={editSku} onChange={(e) => setEditSku(e.target.value)}
                    style={{ fontSize: '16px' }} className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest">SEARCH TAGS (COMMA SEPARATED)</label>
                  <input
                    type="text" value={editTagsInput} onChange={(e) => setEditTagsInput(e.target.value)}
                    style={{ fontSize: '16px' }} className="w-full bg-white border-2 border-black px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Specification key-value fields list */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold uppercase tracking-widest">SPECIFICATIONS</label>
                  <button type="button" onClick={addFeatureRow} className="border border-black px-2 py-0.5 font-bold text-[8px] hover:bg-black hover:text-white transition-colors">
                    + ADD ROW
                  </button>
                </div>
                <div className="space-y-1.5">
                  {editFeatures.map((feat, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text" placeholder="KEY" value={feat.key} onChange={(e) => updateFeatureRow(idx, 'key', e.target.value)}
                        className="flex-1 bg-white border-2 border-black px-2 py-1 text-xs focus:outline-none"
                      />
                      <input
                        type="text" placeholder="VALUE" value={feat.value} onChange={(e) => updateFeatureRow(idx, 'value', e.target.value)}
                        className="flex-1 bg-white border-2 border-black px-2 py-1 text-xs focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Replace images */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold uppercase tracking-widest">REPLACE IMAGES (OPTIONAL)</label>
                <div className="relative border-2 border-dashed border-black bg-white p-4 flex flex-col items-center justify-center text-center">
                  <input
                    type="file" multiple accept="image/*" onChange={(e) => setEditImageFiles(Array.from(e.target.files))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload size={16} className="text-neutral-400 mb-1" />
                  {editImageFiles.length > 0 ? (
                    <span className="text-[10px] font-bold text-black uppercase">{editImageFiles.length} FILES SELECTED</span>
                  ) : (
                    <span className="text-[10px] text-neutral-400 uppercase">SELECT IMAGES TO OVERWRITE</span>
                  )}
                </div>
              </div>

              <button
                type="submit" disabled={submitting}
                className="w-full bg-black text-white font-space font-bold uppercase text-xs py-4 border-2 border-black hover:bg-white hover:text-black transition-colors touch-manipulation mt-2"
              >
                {submitting ? 'UPLOADING AND SAVING...' : 'SAVE CHANGES'}
              </button>
            </form>
          ) : (
            /* ── REGULAR USER DETAILS VIEW ── */
            <>
              {/* Name */}
              <h1 className="font-inter font-black text-3xl sm:text-4xl md:text-5xl xl:text-6xl uppercase tracking-tighter leading-none mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 font-space text-[9px] md:text-xs text-neutral-500 uppercase tracking-wider mb-5">
                <span>{'█'.repeat(Math.round(product.rating || 5))}{'░'.repeat(5 - Math.round(product.rating || 5))}</span>
                <span>{product.rating || '5.0'} / 5.0</span>
                {isAdmin && (
                  <>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline">{product.salesCount || 0} SOLD</span>
                  </>
                )}
              </div>

              {/* Price block */}
              <div className="border-2 border-black p-4 md:p-5 mb-5 bg-white shadow-solid-sm">
                <div className="font-space font-black text-3xl md:text-5xl text-black tracking-tight">
                  ₹{product.sellingPrice.toLocaleString('en-IN')}
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                  {saving > 0 && (
                    <>
                      <span className="font-space text-xs text-neutral-500 line-through">
                        MRP ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                      <span className="font-space text-[9px] md:text-xs font-bold bg-black text-white px-2 py-0.5">
                        SAVE ₹{saving.toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </div>
                <p className="font-space text-[9px] md:text-xs text-neutral-500 mt-2 uppercase tracking-wider">
                  Incl. taxes · Free shipping · {product.deliveryDays || 5} days
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-5">
                <span className="font-space text-[10px] md:text-xs font-bold uppercase tracking-widest">QTY:</span>
                <div className="flex items-center border-2 border-black bg-white">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center border-r-2 border-black hover:bg-black hover:text-white transition-colors duration-75 touch-manipulation"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 md:w-12 text-center font-space font-bold text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
                    className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center border-l-2 border-black hover:bg-black hover:text-white transition-colors duration-75 touch-manipulation"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Desktop CTA */}
              <motion.button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                whileTap={{ scale: 0.98 }}
                transition={spring}
                className={`hidden md:flex w-full items-center justify-center gap-3 font-space font-black uppercase text-sm py-5 border-4 border-black shadow-solid transition-colors duration-75 mb-6 ${
                  product.stock === 0
                    ? 'bg-neutral-100 text-neutral-400 border-neutral-300 cursor-not-allowed shadow-none'
                    : added
                      ? 'bg-black text-white'
                      : 'bg-black text-white hover:bg-white hover:text-black'
                }`}
              >
                <ShoppingBag size={18} />
                {product.stock === 0 ? 'SOLD OUT' : added ? '✓ ADDED' : 'ADD TO INVENTORY'}
              </motion.button>

              {/* Description */}
              <p className="font-space text-xs md:text-sm text-neutral-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Accordion sections */}
              <div className="border-b-2 border-black bg-white">
                {product.features && product.features.length > 0 && (
                  <AccordionSection title="SPECS & DIMENSIONS">
                    <table className="w-full font-space text-xs">
                      <tbody>
                        {product.features.map((f) => (
                          <tr key={f.key} className="border-t border-neutral-200">
                            <td className="py-2 pr-3 text-neutral-500 uppercase tracking-wider w-2/5">{f.key}</td>
                            <td className="py-2 font-bold uppercase text-right md:text-left">{f.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </AccordionSection>
                )}

                <AccordionSection title="SHIPPING & HANDLING">
                  <div className="font-space text-xs text-neutral-600 leading-relaxed space-y-1.5">
                    <p>FREE STANDARD SHIPPING ON ALL ORDERS.</p>
                    <p>DELIVERY: {product.deliveryDays || 5}–{Number(product.deliveryDays || 5) + 2} BUSINESS DAYS.</p>
                    <p>SHIPS IN RIGID FLAT MAILERS. NO TUBES.</p>
                    <p>TRACKING VIA EMAIL POST-DISPATCH.</p>
                  </div>
                </AccordionSection>

                <AccordionSection title="MATERIALS & QUALITY">
                  <div className="font-space text-xs text-neutral-600 leading-relaxed space-y-1.5">
                    <p>300 GSM ARCHIVAL MATTE PAPER — ACID-FREE.</p>
                    <p>PIGMENT INKJET MONOCHROME. ZERO COLOR LEAKAGE.</p>
                    <p>SOLID WOOD FRAME — BLACK LACQUER. 20MM PROFILE.</p>
                    <p>3MM GALLERY-GRADE GLASS. ANTI-GLARE. UV-PROTECTED.</p>
                  </div>
                </AccordionSection>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sticky CTA (Hidden in Edit Mode) */}
      {!editOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t-4 border-black bg-white px-4 py-3 flex items-center gap-3 shadow-[0_-4px_0_0_#000]">
          <div className="flex-1 min-w-0">
            <div className="font-space font-black text-lg leading-none">₹{product.sellingPrice.toLocaleString('en-IN')}</div>
            <div className="font-space text-[9px] text-neutral-500 uppercase tracking-wider">INCL. ALL TAXES</div>
          </div>
          <div className="flex items-center border-2 border-black shrink-0 bg-white">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center border-r-2 border-black hover:bg-black hover:text-white touch-manipulation">
              <Minus size={12} />
            </button>
            <span className="w-8 text-center font-space font-bold text-xs">{qty}</span>
            <button onClick={() => setQty(Math.min(product.stock || 99, qty + 1))} className="w-10 h-10 flex items-center justify-center border-l-2 border-black hover:bg-black hover:text-white touch-manipulation">
              <Plus size={12} />
            </button>
          </div>
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            whileTap={{ scale: 0.97 }}
            transition={spring}
            className={`flex items-center gap-2 font-space font-black uppercase text-xs px-5 py-3 border-2 border-black shrink-0 transition-colors duration-75 touch-manipulation ${
              product.stock === 0
                ? 'bg-neutral-100 text-neutral-400 border-neutral-300 cursor-not-allowed'
                : added
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
            }`}
          >
            <ShoppingBag size={14} />
            {product.stock === 0 ? 'OUT' : added ? '✓ ADDED' : 'ADD'}
          </motion.button>
        </div>
      )}

      <Popup
        isOpen={deletePopupOpen}
        title="DELETE PRODUCT"
        message={`ARE YOU SURE YOU WANT TO REMOVE "${product?.name?.toUpperCase()}" PERMANENTLY?`}
        confirmText="DELETE"
        cancelText="CANCEL"
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeletePopupOpen(false)}
      />
    </div>
  );
}

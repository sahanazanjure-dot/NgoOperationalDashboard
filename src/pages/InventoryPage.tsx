import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Download,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  MapPin,
  Calendar,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle,
  Package,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { InventoryItem } from '../types';
import { exportModuleExcel } from '../utils/excelExport';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const InventoryPage: React.FC = () => {
  const { inventory, addInventory, updateInventory, logStockMovement, deleteInventory, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [movementItem, setMovementItem] = useState<InventoryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Water & Sanitation');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState('kits');
  const [location, setLocation] = useState('Pune Central Warehouse');
  const [reorderLevel, setReorderLevel] = useState<number>(5);
  const [supplier, setSupplier] = useState('');
  const [unitCost, setUnitCost] = useState<number>(25);

  // Movement Form
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN');
  const [movementQty, setMovementQty] = useState<number>(5);
  const [movementReason, setMovementReason] = useState('Standard restock shipment');

  const filteredInventory = useMemo(() => {
    return inventory.filter(i => {
      const matchSearch = i.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || i.status === statusFilter;
      const matchCat = categoryFilter === 'all' || i.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [inventory, searchQuery, statusFilter, categoryFilter]);

  const totalValuation = useMemo(() => {
    return filteredInventory.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0);
  }, [filteredInventory]);

  const lowStockCount = useMemo(() => {
    return inventory.filter(i => i.status === 'Low Stock' || i.status === 'Depleted').length;
  }, [inventory]);

  const handleExportExcel = () => {
    const exportData = filteredInventory.map(i => ({
      'Item ID': i.id,
      'Item Name': i.itemName,
      'Category': i.category,
      'Quantity': i.quantity,
      'Unit': i.unit,
      'Unit Cost ($)': i.unitCost,
      'Total Valuation ($)': i.quantity * i.unitCost,
      'Location / Depot': i.location,
      'Reorder Threshold': i.reorderLevel,
      'Status': i.status,
      'Supplier': i.supplier
    }));
    exportData.push({
      'Item ID': 'TOTAL',
      'Item Name': 'TOTAL INVENTORY VALUATION',
      'Category': '-',
      'Quantity': 0,
      'Unit': '-',
      'Unit Cost ($)': 0,
      'Total Valuation ($)': totalValuation,
      'Location / Depot': '-',
      'Reorder Threshold': 0,
      'Status': '-',
      'Supplier': '-'
    });
    exportModuleExcel('Inventory_and_Supplies', exportData);
  };

  const handleOpenCreate = () => {
    setItemName('');
    setCategory('Water & Sanitation');
    setQuantity(20);
    setUnit('units');
    setLocation('Pune Central Warehouse');
    setReorderLevel(5);
    setSupplier('');
    setUnitCost(40);
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (i: InventoryItem) => {
    setEditingItem(i);
    setItemName(i.itemName);
    setCategory(i.category);
    setQuantity(i.quantity);
    setUnit(i.unit);
    setLocation(i.location);
    setReorderLevel(i.reorderLevel);
    setSupplier(i.supplier);
    setUnitCost(i.unitCost);
  };

  const handleSaveInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<InventoryItem> = {
      itemName,
      category,
      quantity: Number(quantity),
      unit,
      location,
      reorderLevel: Number(reorderLevel),
      supplier,
      unitCost: Number(unitCost),
      purchaseDate: new Date().toISOString().split('T')[0]
    };

    if (editingItem) {
      await updateInventory(editingItem.id, data);
      setEditingItem(null);
    } else {
      await addInventory(data);
      setCreateModalOpen(false);
    }
  };

  const handleCommitMovement = async () => {
    if (!movementItem) return;
    const change = movementType === 'IN' ? Number(movementQty) : -Number(movementQty);
    await logStockMovement(movementItem.id, change, movementReason);
    setMovementItem(null);
  };

  const isAuthorized = currentUser.role === 'Administrator' || currentUser.role === 'Project Manager';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Inventory & Critical Resources
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ${totalValuation.toLocaleString()} Asset Value
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Emergency relief supplies, medical kits, water filtration hardware, and food bank inventory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs cursor-pointer"
            title="Download formatted inventory registry (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Inventory</span>
          </button>

          {isAuthorized && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Total Asset Valuation</span>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-1">${totalValuation.toLocaleString()}</div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Across {filteredInventory.length} Resource Lines</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Low Stock Reorder Alerts</span>
          <div className="text-2xl font-bold font-heading text-amber-700 mt-1">{lowStockCount} Items</div>
          <p className="text-[11px] text-amber-800 font-medium mt-1">Below critical threshold</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Central Warehouses</span>
          <div className="text-2xl font-bold font-heading text-slate-900 mt-1">4 Depots</div>
          <p className="text-[11px] text-slate-500 mt-1">Pune, Amravati, Ratnagiri, Dharavi</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search items, supplier, warehouse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Stock Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Depleted">Depleted</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 font-medium"
          >
            <option value="all">All Resource Categories</option>
            <option value="Water & Sanitation">Water & Sanitation</option>
            <option value="Educational Supplies">Educational Supplies</option>
            <option value="Medical Equipment">Medical Equipment</option>
            <option value="Nutrition & Relief">Nutrition & Relief</option>
            <option value="Disaster Relief">Disaster Relief</option>
            <option value="Food Bank">Food Bank Supplies</option>
            <option value="Agroforestry">Agroforestry & Farming</option>
          </select>
        </div>
      </div>

      {/* Inventory Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInventory.map(item => {
          const isLow = item.status === 'Low Stock';
          const isDepleted = item.status === 'Depleted';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl bg-white border shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${
                isDepleted ? 'border-rose-300 ring-1 ring-rose-200' :
                isLow ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDepleted ? 'bg-rose-100 text-rose-800' :
                    isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-heading leading-snug">
                  {item.itemName}
                </h3>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold font-heading text-slate-900">
                    {item.quantity.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{item.unit}</span>
                  <span className="text-[11px] text-slate-400 ml-auto">
                    Reorder at: {item.reorderLevel}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Supplier: {item.supplier}</span>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Unit Cost: ${item.unitCost}</span>
                  <span className="font-bold text-slate-900">
                    Total: ${(item.quantity * item.unitCost).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 text-xs">
                <button
                  onClick={() => setMovementItem(item)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <span>Stock Movement</span>
                </button>

                {isAuthorized && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(item)} className="p-1 hover:text-slate-900 cursor-pointer">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1 hover:text-rose-600 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Movement Modal (Stock In / Stock Out) */}
      {movementItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 font-heading mb-1">Log Stock Movement</h3>
            <p className="text-xs text-slate-500 mb-4">{movementItem.itemName} ({movementItem.location})</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Movement Direction</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setMovementType('IN')}
                    className={`py-2 rounded-xl font-semibold border text-center ${
                      movementType === 'IN' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    + Stock In
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType('OUT')}
                    className={`py-2 rounded-xl font-semibold border text-center ${
                      movementType === 'OUT' ? 'bg-rose-700 text-white border-rose-700' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    - Issue Out
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Quantity ({movementItem.unit})</label>
                <input
                  type="number"
                  min={1}
                  value={movementQty}
                  onChange={(e) => setMovementQty(Number(e.target.value))}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Reason / Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Field distribution to camp #3"
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setMovementItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCommitMovement}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Save Movement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Resource Modal */}
      {(createModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-4 font-heading">
              {editingItem ? 'Edit Resource Details' : 'Add Inventory Item'}
            </h3>

            <form onSubmit={handleSaveInventory} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. First-Aid Trauma Kits"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Educational Supplies">Educational Supplies</option>
                    <option value="Medical Equipment">Medical Equipment</option>
                    <option value="Nutrition & Relief">Nutrition & Relief</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                    <option value="Food Bank">Food Bank Supplies</option>
                    <option value="Agroforestry">Agroforestry & Farming</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Storage Warehouse / Depot *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Quantity *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Unit Type *</label>
                  <input
                    type="text"
                    required
                    placeholder="kits, boxes, kg"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Reorder Alert Level</label>
                  <input
                    type="number"
                    min={1}
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Supplier / Vendor</label>
                  <input
                    type="text"
                    placeholder="e.g. RedCross MedEquip"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700">Unit Cost ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => { setCreateModalOpen(false); setEditingItem(null); }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete Inventory Item"
        message="Are you sure you want to delete this resource item from the inventory registry?"
        confirmLabel="Delete Item"
        onConfirm={async () => {
          if (deleteId) {
            await deleteInventory(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

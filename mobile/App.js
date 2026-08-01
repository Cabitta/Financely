import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useStore } from './store';

const AVATAR_OPTIONS = ['👨', '👩', '👦', '👧', '👴', '👵', '🧑', '🐶'];
const COLOR_OPTIONS = ['#007AFF', '#FF2D55', '#34C759', '#FF9500', '#AF52DE', '#FF3B30'];

export default function App() {
  const {
    transactions,
    members,
    categories,
    addTransaction,
    deleteTransaction,
    addMember,
    updateCategoryBudget,
    getBalance,
    getTotalIncome,
    getTotalExpenses,
    getExpensesByMember,
    getCategoryBudgetStatus,
  } = useStore();

  // Tab State: 'dashboard' | 'transactions' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals
  const [transModalVisible, setTransModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);

  // New Transaction Form
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || 'c1');
  const [selectedMember, setSelectedMember] = useState(members[0]?.id || 'm1');
  const [note, setNote] = useState('');

  // New Member Form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberAvatar, setNewMemberAvatar] = useState('👨');
  const [newMemberColor, setNewMemberColor] = useState('#007AFF');

  // Budget Edit Form
  const [editingCategory, setEditingCategory] = useState(null);
  const [newBudgetLimit, setNewBudgetLimit] = useState('');

  // Filters for Transactions Tab
  const [memberFilter, setMemberFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Computados
  const balance = getBalance();
  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const expensesByMember = getExpensesByMember();
  const categoryBudgets = getCategoryBudgetStatus();

  // Helpers
  const handleSaveTransaction = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    addTransaction(amount, type, selectedCategory, selectedMember, note);
    setAmount('');
    setNote('');
    setTransModalVisible(false);
  };

  const handleSaveMember = () => {
    if (!newMemberName.trim()) return;
    addMember(newMemberName, newMemberAvatar, newMemberColor);
    setNewMemberName('');
    setMemberModalVisible(false);
  };

  const handleSaveBudget = () => {
    if (!editingCategory || isNaN(newBudgetLimit)) return;
    updateCategoryBudget(editingCategory.id, newBudgetLimit);
    setEditingCategory(null);
    setNewBudgetLimit('');
    setBudgetModalVisible(false);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesMember = memberFilter === 'ALL' || t.memberId === memberFilter;
    const cat = categories.find((c) => c.id === t.categoryId);
    const matchesSearch =
      !searchQuery.trim() ||
      (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cat && cat.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMember && matchesSearch;
  });

  const getMemberById = (id) => members.find((m) => m.id === id) || { name: 'Integrante', avatar: '👤', color: '#8E8E93' };
  const getCategoryById = (id) => categories.find((c) => c.id === id) || { name: 'General', icon: '📦', color: '#8E8E93' };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* iOS HEADER MINIMALISTA */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View>
            <Text style={styles.headerBrand}>Financely</Text>
            <Text style={styles.headerSubtitle}>Presupuesto Familiar • Agosto 2026</Text>
          </View>
          <TouchableOpacity style={styles.headerAddBtn} onPress={() => setTransModalVisible(true)}>
            <Text style={styles.headerAddBtnText}>+ Gasto</Text>
          </TouchableOpacity>
        </View>

        {/* HERO BALANCE CARD - APPLE DESIGN */}
        <View style={styles.balanceHeroCard}>
          <Text style={styles.balanceHeroLabel}>BALANCE DISPONIBLE</Text>
          <Text style={[styles.balanceHeroAmount, { color: balance >= 0 ? '#1C1C1E' : '#FF3B30' }]}>
            ${balance.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>

          <View style={styles.heroMetricsRow}>
            <View style={styles.metricItem}>
              <View style={[styles.metricDot, { backgroundColor: '#34C759' }]} />
              <View>
                <Text style={styles.metricLabel}>Ingresos</Text>
                <Text style={styles.metricIncome}>+${totalIncome.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <View style={[styles.metricDot, { backgroundColor: '#FF3B30' }]} />
              <View>
                <Text style={styles.metricLabel}>Gastos</Text>
                <Text style={styles.metricExpense}>-${totalExpenses.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* iOS SEGMENTED CONTROL TAB BAR */}
      <View style={styles.segmentedWrapper}>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'dashboard' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('dashboard')}
          >
            <Text style={[styles.segmentText, activeTab === 'dashboard' && styles.segmentTextActive]}>📊 Resumen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'transactions' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('transactions')}
          >
            <Text style={[styles.segmentText, activeTab === 'transactions' && styles.segmentTextActive]}>
              📜 Movimientos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'settings' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('settings')}
          >
            <Text style={[styles.segmentText, activeTab === 'settings' && styles.segmentTextActive]}>👥 Familia</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TAB CONTENT 1: RESUMEN / DASHBOARD */}
      {activeTab === 'dashboard' && (
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          {/* ATRIBUCIÓN FAMILIAR */}
          <Text style={styles.sectionHeaderTitle}>Gasto por Integrante</Text>

          <View style={styles.groupedSection}>
            {expensesByMember.map((m, idx) => (
              <View
                key={m.id}
                style={[
                  styles.iosListItem,
                  idx < expensesByMember.length - 1 && styles.iosListItemBorder,
                ]}
              >
                <View style={[styles.avatarBadge, { backgroundColor: m.color + '15' }]}>
                  <Text style={styles.avatarEmoji}>{m.avatar}</Text>
                </View>

                <View style={styles.listContentMain}>
                  <View style={styles.listTitleRow}>
                    <Text style={styles.listTitleText}>{m.name}</Text>
                    <Text style={styles.listAmountText}>${m.spent.toFixed(2)}</Text>
                  </View>

                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${m.percentage}%`, backgroundColor: m.color }]} />
                    </View>
                    <Text style={[styles.progressPercentText, { color: m.color }]}>{m.percentage}%</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* PRESUPUESTO POR CATEGORÍA */}
          <Text style={[styles.sectionHeaderTitle, { marginTop: 24 }]}>Presupuestos por Categoría</Text>

          <View style={styles.groupedSection}>
            {categoryBudgets.map((cat, idx) => {
              const statusColor =
                cat.status === 'exceeded' ? '#FF3B30' : cat.status === 'warning' ? '#FF9500' : '#34C759';

              return (
                <View
                  key={cat.id}
                  style={[
                    styles.iosListItem,
                    idx < categoryBudgets.length - 1 && styles.iosListItemBorder,
                  ]}
                >
                  <View style={[styles.avatarBadge, { backgroundColor: cat.color + '15' }]}>
                    <Text style={styles.avatarEmoji}>{cat.icon}</Text>
                  </View>

                  <View style={styles.listContentMain}>
                    <View style={styles.listTitleRow}>
                      <Text style={styles.listTitleText}>{cat.name}</Text>
                      <Text style={[styles.listSubTextBold, { color: statusColor }]}>
                        ${cat.spent.toFixed(2)} / ${cat.budgetLimit}
                      </Text>
                    </View>

                    <View style={styles.progressRow}>
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(cat.percentage, 100)}%`,
                              backgroundColor: statusColor,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.progressPercentText, { color: statusColor }]}>{cat.percentage}%</Text>
                    </View>

                    {cat.status === 'exceeded' && (
                      <Text style={styles.alertNoteExceeded}>⚠️ Límite excedido por ${(cat.spent - cat.budgetLimit).toFixed(2)}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* TAB CONTENT 2: MOVIMIENTOS */}
      {activeTab === 'transactions' && (
        <View style={styles.tabViewFull}>
          {/* SEARCH & CHIPS */}
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.iosSearchInput}
              placeholder="🔍 Buscar por categoría o nota..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipScroll}>
              <TouchableOpacity
                style={[styles.iosChip, memberFilter === 'ALL' && styles.iosChipActive]}
                onPress={() => setMemberFilter('ALL')}
              >
                <Text style={[styles.iosChipText, memberFilter === 'ALL' && styles.iosChipTextActive]}>Todos</Text>
              </TouchableOpacity>

              {members.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.iosChip, memberFilter === m.id && styles.iosChipActive]}
                  onPress={() => setMemberFilter(m.id)}
                >
                  <Text style={[styles.iosChipText, memberFilter === m.id && styles.iosChipTextActive]}>
                    {m.avatar} {m.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* LISTA DE MOVIMIENTOS */}
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContentPadding}
            ListEmptyComponent={
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateIcon}>📋</Text>
                <Text style={styles.emptyStateText}>No se encontraron movimientos.</Text>
              </View>
            }
            renderItem={({ item }) => {
              const member = getMemberById(item.memberId);
              const category = getCategoryById(item.categoryId);
              const isIncome = item.type === 'INCOME';

              return (
                <View style={styles.iosTransCard}>
                  <View style={[styles.avatarBadge, { backgroundColor: category.color + '15' }]}>
                    <Text style={styles.avatarEmoji}>{category.icon}</Text>
                  </View>

                  <View style={styles.listContentMain}>
                    <View style={styles.listTitleRow}>
                      <Text style={styles.listTitleText}>{category.name}</Text>
                      <Text style={[styles.transAmountText, { color: isIncome ? '#34C759' : '#1C1C1E' }]}>
                        {isIncome ? '+' : '-'}${item.amount.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.transSubRow}>
                      <View style={[styles.memberMiniPill, { backgroundColor: member.color + '15' }]}>
                        <Text style={[styles.memberMiniPillText, { color: member.color }]}>
                          {member.avatar} {member.name}
                        </Text>
                      </View>
                      <Text style={styles.transDateText}>
                        {new Date(item.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                      </Text>
                    </View>

                    {item.note ? <Text style={styles.transNoteText}>"{item.note}"</Text> : null}
                  </View>

                  <TouchableOpacity style={styles.deleteIconButton} onPress={() => deleteTransaction(item.id)}>
                    <Text style={styles.deleteIconText}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      )}

      {/* TAB CONTENT 3: INTEGRANTES & AJUSTES */}
      {activeTab === 'settings' && (
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          {/* SECCIÓN INTEGRANTES */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Integrantes de la Familia</Text>
            <TouchableOpacity style={styles.iosTextBtn} onPress={() => setMemberModalVisible(true)}>
              <Text style={styles.iosTextBtnLabel}>+ Agregar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.groupedSection}>
            {members.map((m, idx) => (
              <View
                key={m.id}
                style={[
                  styles.iosListItem,
                  idx < members.length - 1 && styles.iosListItemBorder,
                ]}
              >
                <View style={[styles.avatarBadge, { backgroundColor: m.color }]}>
                  <Text style={[styles.avatarEmoji, { color: '#FFF' }]}>{m.avatar}</Text>
                </View>

                <View style={styles.listContentMain}>
                  <Text style={styles.listTitleText}>{m.name}</Text>
                </View>

                <Text style={styles.iosBadgeLabel}>Integrante</Text>
              </View>
            ))}
          </View>

          {/* SECCIÓN PRESUPUESTOS */}
          <Text style={[styles.sectionHeaderTitle, { marginTop: 24 }]}>Ajustar Límites Mensuales</Text>

          <View style={styles.groupedSection}>
            {categories
              .filter((c) => c.type === 'EXPENSE')
              .map((c, idx) => (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    styles.iosListItem,
                    idx < categories.filter((c) => c.type === 'EXPENSE').length - 1 && styles.iosListItemBorder,
                  ]}
                  onPress={() => {
                    setEditingCategory(c);
                    setNewBudgetLimit(String(c.budgetLimit));
                    setBudgetModalVisible(true);
                  }}
                >
                  <View style={[styles.avatarBadge, { backgroundColor: c.color + '15' }]}>
                    <Text style={styles.avatarEmoji}>{c.icon}</Text>
                  </View>

                  <View style={styles.listContentMain}>
                    <Text style={styles.listTitleText}>{c.name}</Text>
                  </View>

                  <View style={styles.budgetRightRow}>
                    <Text style={styles.budgetValueText}>${c.budgetLimit}</Text>
                    <Text style={styles.chevronRight}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      )}

      {/* iOS FLOATING ACTION BUTTON (FAB) */}
      <TouchableOpacity style={styles.iosFab} onPress={() => setTransModalVisible(true)}>
        <Text style={styles.iosFabIcon}>+</Text>
      </TouchableOpacity>

      {/* MODAL 1: NUEVO GASTO / INGRESO */}
      <Modal animationType="slide" transparent visible={transModalVisible} onRequestClose={() => setTransModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalSheetOverlay}>
          <View style={styles.modalSheetContainer}>
            <View style={styles.modalSheetHandle} />
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Nuevo Movimiento</Text>
              <TouchableOpacity onPress={() => setTransModalVisible(false)}>
                <Text style={styles.modalSheetCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </View>

            {/* TOGGLE GASTO / INGRESO */}
            <View style={styles.iosToggleRow}>
              <TouchableOpacity
                style={[styles.iosToggleBtn, type === 'EXPENSE' && styles.iosToggleExpenseActive]}
                onPress={() => setType('EXPENSE')}
              >
                <Text style={[styles.iosToggleText, type === 'EXPENSE' && styles.iosToggleTextActive]}>Gasto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iosToggleBtn, type === 'INCOME' && styles.iosToggleIncomeActive]}
                onPress={() => setType('INCOME')}
              >
                <Text style={[styles.iosToggleText, type === 'INCOME' && styles.iosToggleTextActive]}>Ingreso</Text>
              </TouchableOpacity>
            </View>

            {/* MONTO BIG DISPLAY */}
            <View style={styles.amountDisplayCard}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountField}
                placeholder="0.00"
                placeholderTextColor="#C7C7CC"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>

            {/* INTEGRANTE */}
            <Text style={styles.formInputLabel}>¿QUIÉN HIZO EL GASTO?</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollField}>
              {members.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.formSelectChip, selectedMember === m.id && { backgroundColor: m.color, borderColor: m.color }]}
                  onPress={() => setSelectedMember(m.id)}
                >
                  <Text style={styles.chipAvatarEmoji}>{m.avatar}</Text>
                  <Text style={[styles.formSelectChipText, selectedMember === m.id && styles.formSelectChipTextActive]}>
                    {m.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* CATEGORÍA */}
            <Text style={styles.formInputLabel}>CATEGORÍA</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollField}>
              {categories
                .filter((c) => c.type === type)
                .map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.formSelectChip, selectedCategory === c.id && styles.formSelectChipBlueActive]}
                    onPress={() => setSelectedCategory(c.id)}
                  >
                    <Text style={styles.chipAvatarEmoji}>{c.icon}</Text>
                    <Text style={[styles.formSelectChipText, selectedCategory === c.id && styles.formSelectChipTextActive]}>
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>

            {/* NOTA */}
            <Text style={styles.formInputLabel}>NOTA / DETALLE (OPCIONAL)</Text>
            <TextInput
              style={styles.formTextField}
              placeholder="Ej. Supermercado semanal, Combustible..."
              placeholderTextColor="#8E8E93"
              value={note}
              onChangeText={setNote}
            />

            <TouchableOpacity style={styles.iosPrimarySubmitBtn} onPress={handleSaveTransaction}>
              <Text style={styles.iosPrimarySubmitBtnText}>Guardar Movimiento</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* MODAL 2: AGREGAR INTEGRANTE */}
      <Modal animationType="fade" transparent visible={memberModalVisible} onRequestClose={() => setMemberModalVisible(false)}>
        <View style={styles.dialogOverlayCenter}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>Nuevo Integrante</Text>

            <Text style={styles.formInputLabel}>NOMBRE</Text>
            <TextInput
              style={styles.dialogTextField}
              placeholder="Ej. Papá, Mamá, Carla"
              placeholderTextColor="#8E8E93"
              value={newMemberName}
              onChangeText={setNewMemberName}
            />

            <Text style={styles.formInputLabel}>AVATAR</Text>
            <View style={styles.emojiGridRow}>
              {AVATAR_OPTIONS.map((av) => (
                <TouchableOpacity
                  key={av}
                  style={[styles.emojiPickItem, newMemberAvatar === av && styles.emojiPickItemActive]}
                  onPress={() => setNewMemberAvatar(av)}
                >
                  <Text style={styles.emojiPickText}>{av}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formInputLabel}>COLOR DISTINTIVO</Text>
            <View style={styles.colorGridRow}>
              {COLOR_OPTIONS.map((col) => (
                <TouchableOpacity
                  key={col}
                  style={[styles.colorPickItem, { backgroundColor: col }, newMemberColor === col && styles.colorPickItemActive]}
                  onPress={() => setNewMemberColor(col)}
                />
              ))}
            </View>

            <View style={styles.dialogButtonsRow}>
              <TouchableOpacity style={styles.dialogCancelBtn} onPress={() => setMemberModalVisible(false)}>
                <Text style={styles.dialogCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogConfirmBtn} onPress={handleSaveMember}>
                <Text style={styles.dialogConfirmBtnText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: PRESUPUESTO */}
      <Modal animationType="fade" transparent visible={budgetModalVisible} onRequestClose={() => setBudgetModalVisible(false)}>
        <View style={styles.dialogOverlayCenter}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>{editingCategory?.name}</Text>
            <Text style={styles.formInputLabel}>LÍMITE MENSUAL DE GASTO ($)</Text>
            <TextInput
              style={styles.dialogTextField}
              placeholder="0.00"
              placeholderTextColor="#8E8E93"
              keyboardType="numeric"
              value={newBudgetLimit}
              onChangeText={setNewBudgetLimit}
              autoFocus
            />

            <View style={styles.dialogButtonsRow}>
              <TouchableOpacity style={styles.dialogCancelBtn} onPress={() => setBudgetModalVisible(false)}>
                <Text style={styles.dialogCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogConfirmBtn} onPress={handleSaveBudget}>
                <Text style={styles.dialogConfirmBtnText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerBrand: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '500',
  },
  headerAddBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerAddBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  balanceHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  balanceHeroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  balanceHeroAmount: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 16,
  },
  heroMetricsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  metricLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
  metricIncome: {
    fontSize: 14,
    fontWeight: '700',
    color: '#34C759',
  },
  metricExpense: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF3B30',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5EA',
  },
  segmentedWrapper: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#E3E3E8',
    borderRadius: 12,
    padding: 2,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
  },
  segmentTextActive: {
    color: '#1C1C1E',
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  tabViewFull: {
    flex: 1,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iosTextBtn: {
    paddingHorizontal: 8,
  },
  iosTextBtnLabel: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  groupedSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  iosListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iosListItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  avatarBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  listContentMain: {
    flex: 1,
  },
  listTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  listTitleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  listAmountText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  listSubTextBold: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentText: {
    fontSize: 12,
    fontWeight: '700',
    width: 36,
    textAlign: 'right',
  },
  alertNoteExceeded: {
    fontSize: 11,
    color: '#FF3B30',
    fontWeight: '600',
    marginTop: 4,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  iosSearchInput: {
    backgroundColor: '#E3E3E8',
    color: '#1C1C1E',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  filterChipScroll: {
    flexDirection: 'row',
  },
  iosChip: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  iosChipActive: {
    backgroundColor: '#007AFF',
  },
  iosChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3A3A3C',
  },
  iosChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContentPadding: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyStateContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyStateIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  iosTransCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  transAmountText: {
    fontSize: 15,
    fontWeight: '700',
  },
  transSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  memberMiniPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  memberMiniPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  transDateText: {
    fontSize: 11,
    color: '#8E8E93',
  },
  transNoteText: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 2,
  },
  deleteIconButton: {
    padding: 6,
  },
  deleteIconText: {
    fontSize: 14,
    color: '#C7C7CC',
  },
  iosBadgeLabel: {
    fontSize: 12,
    color: '#8E8E93',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  budgetRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  budgetValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007AFF',
  },
  chevronRight: {
    fontSize: 18,
    color: '#C7C7CC',
  },
  iosFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  iosFabIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -2,
  },
  modalSheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalSheetHandle: {
    width: 36,
    height: 5,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  modalSheetCloseText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
  },
  iosToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#E3E3E8',
    borderRadius: 10,
    padding: 2,
    marginBottom: 16,
  },
  iosToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  iosToggleExpenseActive: {
    backgroundColor: '#FF3B30',
  },
  iosToggleIncomeActive: {
    backgroundColor: '#34C759',
  },
  iosToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#636366',
  },
  iosToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  amountDisplayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginRight: 4,
  },
  amountField: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1C1C1E',
    minWidth: 120,
  },
  formInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 6,
  },
  horizontalScrollField: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  formSelectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  formSelectChipBlueActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  chipAvatarEmoji: {
    fontSize: 16,
  },
  formSelectChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  formSelectChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formTextField: {
    backgroundColor: '#F2F2F7',
    color: '#1C1C1E',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 20,
  },
  iosPrimarySubmitBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  iosPrimarySubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dialogOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
    textAlign: 'center',
  },
  dialogTextField: {
    backgroundColor: '#F2F2F7',
    color: '#1C1C1E',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  emojiGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  emojiPickItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiPickItemActive: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  emojiPickText: {
    fontSize: 18,
  },
  colorGridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  colorPickItem: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorPickItemActive: {
    borderWidth: 3,
    borderColor: '#1C1C1E',
  },
  dialogButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  dialogCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dialogCancelBtnText: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  dialogConfirmBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  dialogConfirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

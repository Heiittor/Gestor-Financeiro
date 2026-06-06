import { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ScrollView,
} from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import { colors } from "../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR");
}

export default function Transactions() {
  const { transactions, loading, error, refresh, removeTransaction } =
    useContext(MoneyContext);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [refreshing, setRefreshing] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const filtered = (transactions || []).filter((t) => {
    if (!t || !t.date) return false;
    const d = new Date(t.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const handleLongPress = (tx) => {
    setSelectedTx(tx);
    setEditModal(true);
  };

  const handleDelete = () => {
    if (!selectedTx) return;
    Alert.alert(
      "Excluir transação",
      `Deseja excluir "${selectedTx?.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setEditModal(false);
            await removeTransaction(selectedTx?.id);
            setSelectedTx(null);
          },
        },
      ]
    );
  };

  const userName = global.loggedUser || "Usuário";

  const years = [];
  for (let y = now.getFullYear() - 2; y <= now.getFullYear() + 1; y++) {
    years.push(y);
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={refresh}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Boas-vindas */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>Olá, {userName}! 👋</Text>
      </View>

      {/* Filtro mês/ano */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {MONTHS.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.monthBtn, selectedMonth === i && styles.monthBtnActive]}
              onPress={() => setSelectedMonth(i)}
            >
              <Text style={[styles.monthText, selectedMonth === i && styles.monthTextActive]}>
                {m.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }}>
          {years.map((y) => (
            <TouchableOpacity
              key={y}
              style={[styles.monthBtn, selectedYear === y && styles.monthBtnActive]}
              onPress={() => setSelectedYear(y)}
            >
              <Text style={[styles.monthText, selectedYear === y && styles.monthTextActive]}>
                {y}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item?.id ?? Math.random().toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma transação neste período.</Text>
        }
        renderItem={({ item }) => {
          if (!item) return null;
          const cat = item.category ?? {};
          const isIncome = cat?.isIncome ?? false;
          return (
            <TouchableOpacity
              style={styles.item}
              onLongPress={() => handleLongPress(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: cat?.background || "#ccc" }]}>
                <MaterialIcons name={cat?.icon || "label"} size={22} color="#fff" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <Text style={styles.itemDate}>{formatDate(item.date)} · {cat?.displayName}</Text>
              </View>
              <Text style={[styles.itemValue, { color: isIncome ? colors.positiveText : colors.negativeText }]}>
                {isIncome ? "+" : "-"}{formatCurrency(item.value)}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Modal de ações */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedTx?.description ?? ""}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={handleDelete}>
              <MaterialIcons name="delete" size={20} color="#fff" />
              <Text style={styles.modalBtnText}>Excluir transação</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => { setEditModal(false); setSelectedTx(null); }}>
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  welcome: { backgroundColor: colors.primary, padding: 12, paddingHorizontal: 16 },
  welcomeText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  filterContainer: { backgroundColor: "#fff", padding: 10, borderBottomWidth: 1, borderColor: "#eee" },
  monthBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 6, backgroundColor: "#f0f0f0" },
  monthBtnActive: { backgroundColor: colors.primary },
  monthText: { fontSize: 13, color: "#666" },
  monthTextActive: { color: "#fff", fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 40, color: "#aaa" },
  item: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 12, marginTop: 10, borderRadius: 12, padding: 14, elevation: 1 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: 12 },
  itemInfo: { flex: 1 },
  itemDesc: { fontSize: 15, fontWeight: "600", color: "#333" },
  itemDate: { fontSize: 12, color: "#999", marginTop: 2 },
  itemValue: { fontSize: 15, fontWeight: "bold" },
  errorText: { color: "red", marginBottom: 12 },
  retryBtn: { backgroundColor: colors.primary, padding: 12, borderRadius: 8 },
  retryText: { color: "#fff", fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#333" },
  modalBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#e53935", borderRadius: 10, padding: 14, marginBottom: 10, gap: 8 },
  modalBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  modalCancel: { padding: 14, alignItems: "center" },
  modalCancelText: { color: "#666", fontSize: 15 },
});
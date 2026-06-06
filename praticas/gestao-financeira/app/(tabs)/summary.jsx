import { useContext, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import { colors } from "../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { G, Path, Circle, Text as SvgText } from "react-native-svg";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const { width } = Dimensions.get("window");

function formatCurrency(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function PieChart({ data }) {
  const size = width * 0.6;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 20;

  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  let startAngle = -Math.PI / 2;
  const slices = data.map((d) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const slice = { ...d, startAngle, angle };
    startAngle += angle;
    return slice;
  });

  const polarToCartesian = (cx, cy, r, angle) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  });

  return (
    <Svg width={size} height={size}>
      {slices.map((slice, i) => {
        const start = polarToCartesian(cx, cy, r, slice.startAngle);
        const end = polarToCartesian(cx, cy, r, slice.startAngle + slice.angle);
        const largeArc = slice.angle > Math.PI ? 1 : 0;
        const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
        return <Path key={i} d={d} fill={slice.color} />;
      })}
      <Circle cx={cx} cy={cy} r={r * 0.5} fill="#fff" />
    </Svg>
  );
}

export default function Summary() {
  const { transactions, categories } = useContext(MoneyContext);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const years = [];
  for (let y = now.getFullYear() - 2; y <= now.getFullYear() + 1; y++) {
    years.push(y);
  }

  const filtered = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totals = categories.map((cat) => {
    const total = filtered
      .filter((t) => t.categoryId === cat.id)
      .reduce((sum, t) => sum + Number(t.value), 0);
    return { ...cat, total };
  });

  const income = totals.filter((c) => c.isIncome).reduce((s, c) => s + c.total, 0);
  const expenses = totals.filter((c) => !c.isIncome).reduce((s, c) => s + c.total, 0);
  const balance = income - expenses;

  const pieData = totals
    .filter((c) => c.total > 0)
    .map((c) => ({ value: c.total, color: c.background, label: c.displayName }));

  return (
    <ScrollView style={styles.container}>
      {/* Filtro mês */}
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

      {/* Gráfico de pizza */}
      {pieData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Distribuição</Text>
          <View style={styles.chartRow}>
            <PieChart data={pieData} />
            <View style={styles.legend}>
              {pieData.map((d, i) => (
                <View key={i} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                  <Text style={styles.legendText}>{d.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Lista por categoria */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Por categoria</Text>
        {totals.map((cat) => (
          <View key={cat.id} style={styles.item}>
            <View style={[styles.iconCircle, { backgroundColor: cat.background }]}>
              <MaterialIcons name={cat.icon} size={20} color="#fff" />
            </View>
            <Text style={styles.itemName}>{cat.displayName}</Text>
            <Text style={[styles.itemValue, { color: cat.isIncome ? colors.positiveText : colors.negativeText }]}>
              {formatCurrency(cat.total)}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />
        <View style={styles.item}>
          <Text style={[styles.itemName, { fontWeight: "bold", fontSize: 16 }]}>Saldo</Text>
          <Text style={[styles.itemValue, { fontWeight: "bold", fontSize: 16, color: balance >= 0 ? colors.positiveText : colors.negativeText }]}>
            {formatCurrency(balance)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterContainer: { backgroundColor: "#fff", padding: 10, borderBottomWidth: 1, borderColor: "#eee" },
  monthBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 6, backgroundColor: "#f0f0f0" },
  monthBtnActive: { backgroundColor: colors.primary },
  monthText: { fontSize: 13, color: "#666" },
  monthTextActive: { color: "#fff", fontWeight: "bold" },
  chartContainer: { backgroundColor: "#fff", margin: 12, borderRadius: 12, padding: 16, elevation: 1 },
  chartRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  legend: { flex: 1, paddingLeft: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendText: { fontSize: 12, color: "#555" },
  listContainer: { backgroundColor: "#fff", margin: 12, borderRadius: 12, padding: 16, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 12, color: "#333" },
  item: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", marginRight: 10 },
  itemName: { flex: 1, fontSize: 14, color: "#333" },
  itemValue: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 8 },
});
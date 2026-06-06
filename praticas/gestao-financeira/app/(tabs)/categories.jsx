import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MoneyContext } from "../../contexts/GlobalState";
import Button from "../../components/Button";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

const PRESET_COLORS = [
  "#DE9AC3", "#DEA17B", "#E6E088", "#AB8FBE",
  "#82C9DE", "#FFB6B6", "#9ED9A9", "#F5C26B",
];

const EMOJI_LIST = [
  { emoji: "🍔", tags: ["hamburguer", "comida", "lanche", "fast food"] },
  { emoji: "🏠", tags: ["casa", "home", "moradia", "lar"] },
  { emoji: "📚", tags: ["livro", "estudo", "educacao", "escola"] },
  { emoji: "✈️", tags: ["aviao", "viagem", "voo", "avião"] },
  { emoji: "💰", tags: ["dinheiro", "renda", "salario", "grana"] },
  { emoji: "❤️", tags: ["coracao", "amor", "saude", "coração"] },
  { emoji: "🏋️", tags: ["academia", "musculacao", "treino", "gym"] },
  { emoji: "🎮", tags: ["jogo", "game", "videogame", "entretenimento"] },
  { emoji: "🚗", tags: ["carro", "transporte", "veiculo", "auto"] },
  { emoji: "🎵", tags: ["musica", "som", "nota", "música"] },
  { emoji: "👗", tags: ["roupa", "moda", "vestido", "shopping"] },
  { emoji: "💊", tags: ["remedio", "medicina", "saude", "farmacia"] },
  { emoji: "🐶", tags: ["cachorro", "pet", "animal", "cao"] },
  { emoji: "🌿", tags: ["planta", "natureza", "verde", "saude"] },
  { emoji: "☕", tags: ["cafe", "bebida", "coffee", "manha"] },
  { emoji: "🎁", tags: ["presente", "gift", "aniversario", "festa"] },
  { emoji: "💼", tags: ["trabalho", "escritorio", "negocios", "business"] },
  { emoji: "🏖️", tags: ["praia", "ferias", "viagem", "lazer"] },
  { emoji: "🎬", tags: ["cinema", "filme", "entretenimento", "movie"] },
  { emoji: "🛒", tags: ["compras", "mercado", "shopping", "feira"] },
  { emoji: "💻", tags: ["computador", "tecnologia", "internet", "laptop"] },
  { emoji: "🏥", tags: ["hospital", "saude", "medico", "clinica"] },
  { emoji: "⚽", tags: ["futebol", "esporte", "bola", "jogo"] },
  { emoji: "🎨", tags: ["arte", "pintura", "criatividade", "design"] },
  { emoji: "🍕", tags: ["pizza", "comida", "lanche", "jantar"] },
  { emoji: "🚌", tags: ["onibus", "transporte", "bus", "ônibus"] },
  { emoji: "💈", tags: ["barbearia", "cabelo", "beleza", "barber"] },
  { emoji: "🌎", tags: ["viagem", "mundo", "internacional", "terra"] },
  { emoji: "📱", tags: ["celular", "telefone", "smartphone", "mobile"] },
  { emoji: "🎓", tags: ["formatura", "educacao", "faculdade", "escola"] },
  { emoji: "🏊", tags: ["natacao", "piscina", "esporte", "nadar"] },
  { emoji: "🍺", tags: ["cerveja", "bebida", "bar", "lazer"] },
];

// Ícones Material padrão do seed
const MATERIAL_ICONS = ["work", "fastfood", "home", "book", "airplanemode-active", "label"];

function CategoryIcon({ item }) {
  const isMaterial = MATERIAL_ICONS.includes(item.icon);
  if (isMaterial) {
    return (
      <View style={[styles.iconCircle, { backgroundColor: item.background }]}>
        <MaterialIcons name={item.icon} size={22} color="#fff" />
      </View>
    );
  }
  return (
    <View style={[styles.iconCircle, { backgroundColor: item.background }]}>
      <Text style={styles.iconEmoji}>{item.icon}</Text>
    </View>
  );
}

export default function CategoriesScreen() {
  const { categories, loading, addCategory, removeCategory } =
    useContext(MoneyContext);

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [icon, setIcon] = useState(EMOJI_LIST[0].emoji);
  const [background, setBackground] = useState(PRESET_COLORS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState("");

  const filteredEmojis = emojiSearch.trim().length === 0
    ? []
    : EMOJI_LIST.filter((e) =>
        e.tags.some((tag) =>
          tag.includes(emojiSearch.toLowerCase().trim())
        )
      );

  const resetForm = () => {
    setName("");
    setDisplayName("");
    setIcon(EMOJI_LIST[0].emoji);
    setBackground(PRESET_COLORS[0]);
    setEmojiSearch("");
  };

  const handleCreate = async () => {
    if (!name.trim() || name.trim().length < 2) {
      Alert.alert("Informe um identificador (mín. 2 letras, sem espaços).");
      return;
    }
    if (!displayName.trim() || displayName.trim().length < 2) {
      Alert.alert("Informe o nome de exibição (mín. 2 letras).");
      return;
    }

    setSubmitting(true);
    try {
      await addCategory({
        name: name.trim().toLowerCase().replace(/\s+/g, "_"),
        displayName: displayName.trim(),
        icon: icon,
        background,
        isIncome: false,
      });
      resetForm();
      Alert.alert("Categoria criada!");
    } catch (e) {
      Alert.alert("Erro ao salvar", e.message ?? "Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Excluir categoria",
      `Deseja excluir "${item.displayName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await removeCategory(item.id);
            } catch (e) {
            Alert.alert(
                "Erro ao excluir",
                e.message?.includes("FK") 
                  ? "Esta categoria possui transações vinculadas a ela. Exclua as transações primeiro."
                  : e.message ?? "Tente novamente."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading && categories.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Nova categoria</Text>

            <View>
              <Text style={globalStyles.inputLabel}>Identificador</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="ex.: academia"
                autoCapitalize="none"
                style={globalStyles.input}
              />
            </View>

            <View>
              <Text style={globalStyles.inputLabel}>Nome da categoria</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="ex.: Academia"
                style={globalStyles.input}
              />
            </View>

            <View>
              <Text style={globalStyles.inputLabel}>
                Ícone selecionado: <Text style={styles.selectedEmoji}>{icon}</Text>
              </Text>
              <TextInput
                value={emojiSearch}
                onChangeText={setEmojiSearch}
                placeholder="Pesquise: aviao, comida, casa..."
                autoCapitalize="none"
                style={globalStyles.input}
              />
              {filteredEmojis.length > 0 && (
                <View style={styles.emojiGrid}>
                  {filteredEmojis.map((e) => (
                    <TouchableOpacity
                      key={e.emoji}
                      onPress={() => { setIcon(e.emoji); setEmojiSearch(""); }}
                      style={[
                        styles.emojiBtn,
                        icon === e.emoji && styles.emojiBtnSelected,
                      ]}
                    >
                      <Text style={styles.emojiText}>{e.emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {emojiSearch.trim().length > 0 && filteredEmojis.length === 0 && (
                <Text style={styles.noResult}>Nenhum emoji encontrado.</Text>
              )}
            </View>

            <View>
              <Text style={globalStyles.inputLabel}>Cor</Text>
              <View style={styles.colorRow}>
                {PRESET_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setBackground(c)}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c },
                      background === c && styles.colorDotSelected,
                    ]}
                  />
                ))}
              </View>
            </View>

            <Button onPress={handleCreate} disabled={submitting}>
              {submitting ? "Salvando..." : "Adicionar categoria"}
            </Button>

            <View style={[globalStyles.line, { marginTop: 16 }]} />
            <Text style={styles.sectionTitle}>Categorias cadastradas</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.categoryRow}>
            <CategoryIcon item={item} />
            <View style={styles.categoryInfo}>
              <Text style={globalStyles.primaryText}>{item.displayName}</Text>
              <Text style={globalStyles.secondaryText}>
                {item.isDefault ? "padrão" : "personalizada"}
                {item.isIncome ? " · receita" : ""}
              </Text>
            </View>
            {!item.isDefault && (
              <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={8}>
                <MaterialIcons name="delete-outline" size={24} color={colors.negativeText} />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  formContainer: {
    gap: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryText,
    marginTop: 4,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
  },
  categoryInfo: { flex: 1 },
  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorDotSelected: {
    borderColor: colors.primaryText,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderWidth: 2,
    borderColor: "transparent",
  },
  emojiBtnSelected: {
    borderColor: colors.primary,
    backgroundColor: "#e8f8f1",
  },
  emojiText: { fontSize: 24 },
  selectedEmoji: { fontSize: 20 },
  noResult: { color: "#aaa", fontSize: 13, marginTop: 6 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: { fontSize: 22 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
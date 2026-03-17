import { faker } from "@faker-js/faker";
import { db } from "./index";
import { leaderboard, roasts, scores, submissions } from "./schema";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
] as const;

const ROAST_TYPES = ["sarcastic", "constructive", "brutal"] as const;
const PERIODS = ["daily", "weekly", "all_time"] as const;

const SARCATIC_ROASTS = [
  "Esse código parece que foi escrito durante um apagão cerebral às 3 da manhã.",
  "Parabéns, você conseguiu fazer um 'Hello World' em 200 linhas.",
  "Eu vi códigos melhores em tutoriais de 2005.",
  "Seu código tem mais bugs que um filme de terror.",
  "Isso não é código, é umaconfissão de crimes contra a programação.",
  "Você sabia que functions existem? Provavelmente não.",
  "Parabéns pelo código. Minha avó codava melhor usando punch cards.",
  "Isso explica por que seu app nunca passa nos testes.",
  "Eu tenho medo de perguntar quem ensinou você a programar.",
  "Você abriu o Stack Overflow e copiou sem entender nada, não é?",
  "Esse código é tão ruim que até o compilador está chorando.",
  "Isso não é 技术, é um crime organizado.",
  "Se isso fosse um filme, seria classificado como Horror.",
  "Meu hamster escreve código melhor no teclado dele.",
  "Você conseguiu violar todas as boas práticas em um único arquivo.",
];

const CONSTRUCTIVE_ROASTS = [
  "Tente usar funções pequenas e reutilizáveis em vez de funções gigantes.",
  "Considere usar tipos explícitos para melhorar a manutenção do código.",
  "Separar as responsabilidades em módulos pode ajudar muito.",
  "Documentar o código vai facilitar a vida de quem vai dar manutenção.",
  "Testes unitários dariam mais confiança nessa implementação.",
  "Naming conventions consistentes melhoram a legibilidade muito.",
  "Tente extrair a lógica de negócio para funções mais limpas.",
  "Esse código pode ser refatorado para ser maisidiomático.",
  "Considere usar composition em vez de herança aqui.",
  "Estruturas de dados mais adequadas resolveriam a complexidade.",
  "Você pode usar async/await para evitar o callback hell.",
  "Erros tratados corretamente evitariam surpresas em produção.",
  "Um pouco de inversion of control melhoraria esse design.",
  "DRY não é só um princípio, é um pedido de emergência.",
  "Esse pattern seria maiselegante com um pouco de refactoring.",
];

const BRUTAL_ROASTS = [
  "isso não compila. Nem tenta disfarçar.",
  "Isso está quebrado. Simplesmente não funciona.",
  "Zero testes. Zero preocupação. Totaldesastre.",
  "Esse código é um liability, não um asset.",
  "Eu não consigo acreditar que isso passou no review.",
  "Você não sabe o que está fazendo. Ponto.",
  "Isso é tão ruim que eu me recuso a revisar.",
  "Se isso fosse meu código, eu teria vergonha.",
  "Esse negócio não presta. 重写 tudo.",
  "Eu não sei nem por onde começar a criticar isso.",
  "Volta a estudar. Isso está longe de estarpronto.",
  "Isso aqui é um anti-pattern ambulante.",
  "Ninguém deveria ter que dar manutenção nisso.",
  "Eu vou precisar de terapia depois de ver isso.",
  "Esse commit deveria ter sido bloqueado no CI.",
];

function generateCode(language: string): string {
  const templates: Record<string, string[]> = {
    javascript: [
      `function processData(data) { ${faker.lorem.words(10)} return data.map(x => x * 2); }`,
      `const api = require('./api');\nmodule.exports = { get: () => api.fetch() };`,
      `var result = data.filter(x => x > 10).map(x => x.toString());`,
    ],
    typescript: [
      `interface User { name: string; age: number; }\nconst getUser = (): User => ({ name: 'test', age: 25 });`,
      `type Response<T> = { data: T; status: number };`,
      `const process = (input: string): number => { return parseInt(input); };`,
    ],
    python: [
      `def process_data(items):\n    return [x * 2 for x in items if x > 0]`,
      `class DataProcessor:\n    def __init__(self, data):\n        self.data = data`,
      `result = list(filter(lambda x: x > 10, data))`,
    ],
    java: [
      `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}`,
      `public List<Integer> process(List<Integer> data) {\n    return data.stream().map(x -> x * 2).collect(Collectors.toList());\n}`,
      `private String name; public String getName() { return name; }`,
    ],
    go: [
      `func ProcessData(data []int) []int {\n    result := make([]int, 0)\n    return result\n}`,
      `func main() {\n    fmt.Println("Hello World")\n}`,
      `type User struct {\n    Name string\n    Age int\n}`,
    ],
    rust: [
      `fn main() {\n    println!("Hello, world!");\n}`,
      `fn process(data: Vec<i32>) -> Vec<i32> {\n    data.iter().map(|x| x * 2).collect()\n}`,
      `struct User {\n    name: String,\n    age: u32,\n}`,
    ],
  };

  return faker.helpers.arrayElement(templates[language] || ["// code"]);
}

function generateRoastContent(roastType: (typeof ROAST_TYPES)[number]): string {
  const pools = {
    sarcastic: SARCATIC_ROASTS,
    constructive: CONSTRUCTIVE_ROASTS,
    brutal: BRUTAL_ROASTS,
  };

  return faker.helpers.arrayElement(pools[roastType]);
}

async function seed() {
  console.log("🌱 Starting seed...");

  console.log("Creating 100 submissions with roasts...");

  for (let i = 0; i < 100; i++) {
    const language = faker.helpers.arrayElement(LANGUAGES);
    const roastType = faker.helpers.arrayElement(ROAST_TYPES);
    const createdAt = faker.date.between({
      from: "2025-01-01",
      to: "2026-03-01",
    });

    const [submission] = await db
      .insert(submissions)
      .values({
        code: generateCode(language),
        language,
        createdAt,
      })
      .returning();

    await db.insert(roasts).values({
      submissionId: submission.id,
      content: generateRoastContent(roastType),
      roastType,
      createdAt: new Date(createdAt.getTime() + Math.random() * 3600000),
    });

    const [_score] = await db
      .insert(scores)
      .values({
        submissionId: submission.id,
        totalScore: faker.number.int({ min: 1, max: 100 }),
        codeQuality: faker.number.int({ min: 1, max: 100 }),
        readability: faker.number.int({ min: 1, max: 100 }),
        bestPractices: faker.number.int({ min: 1, max: 100 }),
        createdAt: createdAt,
      })
      .returning();

    if (i < 30) {
      await db.insert(leaderboard).values({
        submissionId: submission.id,
        rankPosition: i + 1,
        period: faker.helpers.arrayElement(PERIODS),
        updatedAt: createdAt,
      });
    }

    if ((i + 1) % 10 === 0) {
      console.log(`  Created ${i + 1}/100 submissions...`);
    }
  }

  console.log("✅ Seed completed! Created 100 submissions with roasts.");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });

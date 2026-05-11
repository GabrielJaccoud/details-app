import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SubmissionStatsProps {
  monthlyData?: Array<{ month: string; submissions: number; completed: number }>;
  statusData?: Array<{ name: string; value: number }>;
  progressData?: Array<{ name: string; progress: number }>;
}

const COLORS = ["#D4AF37", "#1F2937", "#3B82F6", "#10B981", "#F59E0B"];

export function SubmissionStats({
  monthlyData = [
    { month: "Jan", submissions: 2, completed: 1 },
    { month: "Fev", submissions: 3, completed: 2 },
    { month: "Mar", submissions: 5, completed: 3 },
    { month: "Abr", submissions: 4, completed: 3 },
    { month: "Mai", submissions: 6, completed: 4 },
  ],
  statusData = [
    { name: "Rascunho", value: 3 },
    { name: "Enviado", value: 5 },
    { name: "Concluído", value: 4 },
  ],
  progressData = [
    { name: "CNPQ", progress: 85 },
    { name: "Paulo Gustavo", progress: 60 },
    { name: "CAPES", progress: 45 },
    { name: "MinC", progress: 70 },
  ],
}: SubmissionStatsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Submissions Trend */}
      <Card className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Submissões por Mês
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #D4AF37",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#D4AF37" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="submissions"
              stroke="#D4AF37"
              strokeWidth={2}
              name="Total"
              dot={{ fill: "#D4AF37", r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10B981"
              strokeWidth={2}
              name="Concluídos"
              dot={{ fill: "#10B981", r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Status Distribution */}
      <Card className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Distribuição por Status
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #D4AF37",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#D4AF37" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Progress by Edital */}
      <Card className="p-6 border border-border lg:col-span-2">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Progresso de Preenchimento por Edital
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #D4AF37",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#D4AF37" }}
            />
            <Bar dataKey="progress" fill="#D4AF37" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Summary Cards */}
      <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border text-center">
          <p className="text-muted-foreground text-sm mb-2">Total de Submissões</p>
          <p className="text-3xl font-bold text-accent">12</p>
        </Card>
        <Card className="p-4 border border-border text-center">
          <p className="text-muted-foreground text-sm mb-2">Concluídas</p>
          <p className="text-3xl font-bold text-green-500">4</p>
        </Card>
        <Card className="p-4 border border-border text-center">
          <p className="text-muted-foreground text-sm mb-2">Em Progresso</p>
          <p className="text-3xl font-bold text-blue-500">5</p>
        </Card>
        <Card className="p-4 border border-border text-center">
          <p className="text-muted-foreground text-sm mb-2">Taxa de Conclusão</p>
          <p className="text-3xl font-bold text-accent">33%</p>
        </Card>
      </div>
    </div>
  );
}

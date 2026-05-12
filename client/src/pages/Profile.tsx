import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: profile, isLoading: isLoadingProfile } = trpc.profile.getProfile.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const updateProfileMutation = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar perfil: ${error.message}`);
      setIsSaving(false);
    },
  });

  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    cpf: profile?.cpf || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    city: profile?.city || "",
    state: profile?.state || "",
    zipCode: profile?.zipCode || "",
    organization: profile?.organization || "",
    position: profile?.position || "",
    bio: profile?.bio || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfileMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gold-600 mx-auto mb-4" />
          <p className="text-lg font-semibold">Você precisa estar autenticado</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas informações pessoais que serão usadas automaticamente nos formulários
          </p>
        </div>

        {isLoadingProfile ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gold-600" />
          </div>
        ) : (
          <Card className="border-gold-200">
            <CardHeader className="bg-gradient-to-r from-gold-50 to-gold-100 border-b border-gold-200">
              <CardTitle className="text-gold-900">Informações Pessoais</CardTitle>
              <CardDescription>
                Estas informações serão preenchidas automaticamente em novos formulários
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome Completo */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-700 font-semibold">
                    Nome Completo
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    className="border-gold-200 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>

                {/* CPF */}
                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-gray-700 font-semibold">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="border-gold-200 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="border-gold-200 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-semibold">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className="border-gold-200 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>

                {/* Endereço */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="text-gray-700 font-semibold">
                    Endereço
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Rua, número, complemento"
                    className="border-gold-200 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>

                {/* Cidade */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-700 font-semibold">
                    Cidade
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Sua cidade"
                    className="border-gold-200 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>

                {/* Estado */}
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-700 font-semibold">
                    Estado
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="RJ"
                    maxLength={2}
                    className="border-gold-200 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>

                {/* CEP */}
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-gray-700 font-semibold">
                    CEP
                  </Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="00000-000"
                    className="border-gold-200 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>

                {/* Organização */}
                <div className="space-y-2">
                  <Label htmlFor="organization" className="text-gray-700 font-semibold">
                    Organização/Empresa
                  </Label>
                  <Input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Nome da organização"
                    className="border-gold-200 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>

                {/* Posição */}
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-gray-700 font-semibold">
                    Posição/Cargo
                  </Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Seu cargo"
                    className="border-gold-200 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio" className="text-gray-700 font-semibold">
                    Biografia
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Conte um pouco sobre você"
                    rows={4}
                    className="border-gold-200 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setFormData({ ...profile } as typeof formData)}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gold-600 hover:bg-gold-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Perfil
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

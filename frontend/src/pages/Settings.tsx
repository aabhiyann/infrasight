import { Box, Flex, Text } from "../components/ui";
import { useState } from "react";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { authApi } from "../api/authApi";
import { useAuth } from "../contexts/AuthContext";

const Settings = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      await authApi.updateProfile({ username, email });
      setMessage("Profile updated");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setChanging(true);
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setMessage("Password changed");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setChanging(false);
    }
  };

  return (
    <Box>
      <Text as="h2" fontSize="xl" fontWeight="bold" mb="lg">
        Settings
      </Text>
      <Flex direction="column" gap="lg">
        <Box
          p="lg"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
          }}
        >
          <Text as="h3" fontWeight="semibold" mb="md">
            Profile
          </Text>
          <form onSubmit={handleSaveProfile} className="d-flex flex-col gap-md">
            <FormInput
              id="username"
              name="username"
              type="text"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              required
            />
            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <div>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Box>

        <Box
          p="lg"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
          }}
        >
          <Text as="h3" fontWeight="semibold" mb="md">
            Change password
          </Text>
          <form
            onSubmit={handleChangePassword}
            className="d-flex flex-col gap-md"
          >
            <FormInput
              id="currentPassword"
              name="currentPassword"
              type="password"
              label="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <FormInput
              id="newPassword"
              name="newPassword"
              type="password"
              label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <div>
              <Button type="submit" variant="primary" disabled={changing}>
                {changing ? "Updating..." : "Update password"}
              </Button>
            </div>
          </form>
        </Box>

        {message && <Text color="muted">{message}</Text>}
      </Flex>
    </Box>
  );
};

export default Settings;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ScreenContainer, Input, Button } from '../../../components/ui';
import { useAuth } from '../../../hooks/useAuth';
import { authStore } from '../../../store';
import { supabase } from '../../../lib/supabase';
import { fetchProfile, authUserFromSession } from '../../../lib/authHelpers';
import { theme } from '../../../theme';
import type { UserStackScreenProps } from '../../../types/navigation';

const c = theme.colors.cartoon;

type Props = UserStackScreenProps<'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setEmail(user.email ?? '');
    }
  }, [user?.id]);

  async function handleSave() {
    if (!user?.id) return;
    setError(null);
    setSaving(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ name: name.trim() || null, email: email.trim() || null })
        .eq('id', user.id);
      if (updateError) throw updateError;
      const profile = await fetchProfile(user.id);
      const { data: { session } } = await supabase.auth.getSession();
      if (session && profile) {
        const authUser = authUserFromSession(session, profile);
        authStore.getState().setSession(session, profile, authUser);
      }
      navigation.goBack();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer style={styles.screen} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            autoCapitalize="words"
          />
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.buttonRow}>
            <Button
              title="Save"
              onPress={handleSave}
              loading={saving}
              disabled={saving}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.cream,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    padding: theme.spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  buttonRow: {
    marginTop: theme.spacing.md,
  },
  saveButton: {
    backgroundColor: c.red,
  },
});

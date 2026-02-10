import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, Button, Input } from '../../../components/ui';
import { useAuth } from '../../../hooks/useAuth';
import { registerSchema, type RegisterFormData } from '../schemas/registerSchema';
import type { AuthStackParamList } from '../../../types/navigation';
import type { Role } from '../../../types';
import { theme } from '../../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'user', label: 'User' },
  { value: 'mechanic', label: 'Mechanic' },
  { value: 'seller', label: 'Seller' },
];

export function RegisterScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'user',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError(null);
    try {
      const result = await signUp({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone ?? undefined,
        role: data.role,
      });
      if (result.needsEmailConfirmation) {
        setSubmitError(
          'Account created. Please check your email to confirm, then sign in.'
        );
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setSubmitError(message);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Join AutoAssist</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Name"
            placeholder="Your name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="words"
            error={errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            placeholder="you@example.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Phone"
            placeholder="Optional"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="phone-pad"
            error={errors.phone?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            placeholder="At least 6 characters"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />

      <Text style={styles.label}>Role</Text>
      <View style={styles.roleRow}>
        {ROLE_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            title={opt.label}
            variant={selectedRole === opt.value ? 'primary' : 'outline'}
            onPress={() => setValue('role', opt.value)}
            style={styles.roleButton}
          />
        ))}
      </View>
      {errors.role?.message ? (
        <Text style={styles.errorText}>{errors.role.message}</Text>
      ) : null}

      {submitError ? (
        <Text style={styles.errorText}>{submitError}</Text>
      ) : null}

      <Button title="Create account" onPress={handleSubmit(onSubmit)} />
      <View style={styles.footer}>
        <Button
          title="Already have an account? Sign in"
          variant="outline"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.muted,
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  roleRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  roleButton: {
    flex: 1,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.danger,
    marginBottom: theme.spacing.sm,
  },
  footer: {
    marginTop: theme.spacing.md,
  },
});

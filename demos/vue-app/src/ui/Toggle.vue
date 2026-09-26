<script setup lang="ts">
defineProps<{ label: string; modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
    <label>
        <input
            type="checkbox"
            :checked="modelValue"
            @change="
                emit(
                    'update:modelValue',
                    ($event.target as HTMLInputElement).checked,
                )
            "
        />
        {{ label }}
    </label>
</template>

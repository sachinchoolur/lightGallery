<script setup lang="ts" generic="T extends string | number">
const props = defineProps<{
    label: string;
    modelValue: T;
    options: readonly T[];
}>();
const emit = defineEmits<{ 'update:modelValue': [value: T] }>();

function pick(event: Event) {
    const raw = (event.target as HTMLSelectElement).value;
    const match = props.options.find((entry) => String(entry) === raw);
    if (match !== undefined) emit('update:modelValue', match);
}
</script>

<template>
    <label>
        {{ label }}
        <select :value="String(modelValue)" @change="pick">
            <option
                v-for="entry of options"
                :key="String(entry)"
                :value="String(entry)"
            >
                {{ entry }}
            </option>
        </select>
    </label>
</template>

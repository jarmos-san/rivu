<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  import {
    createError,
    queryCollection,
    queryCollectionItemSurroundings,
    queryCollectionNavigation,
    useAsyncData,
    useSeoMeta,
  } from "#imports";

  const PREVIOUS_INDEX = 0;
  const NEXT_INDEX = 1;
  const SINGLE_ROOT = 1;

  const route = useRoute();

  const { data: page } = await useAsyncData(`docs-page-${route.path}`, () =>
    queryCollection("content").path(route.path).first(),
  );

  if (!page.value) {
    throw createError({
      fatal: true,
      statusCode: 404,
      statusMessage: "Page not found",
    });
  }

  const { data: navigation } = await useAsyncData("docs-navigation", () =>
    queryCollectionNavigation("content"),
  );

  const { data: surround } = await useAsyncData(
    `docs-surround-${route.path}`,
    () => queryCollectionItemSurroundings("content", route.path),
  );

  useSeoMeta({
    description: page.value.description,
    ogDescription: page.value.description,
    ogTitle: `${page.value.title} - rivu`,
    title: `${page.value.title} - rivu`,
  });

  const sections = computed(() => {
    const roots = navigation.value ?? [];
    const [root] = roots;

    return roots.length === SINGLE_ROOT && root?.children
      ? root.children
      : roots;
  });
  const previous = computed(() => surround.value?.[PREVIOUS_INDEX]);
  const next = computed(() => surround.value?.[NEXT_INDEX]);
</script>

<template>
  <div
    class="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30"
  >
    <header class="border-b border-slate-800">
      <nav
        class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      >
        <NuxtLink to="/" class="font-mono text-lg font-bold text-white">
          rivu
        </NuxtLink>
        <div class="flex items-center space-x-6 text-sm text-slate-400">
          <a
            href="https://github.com/jarmos-san/rivu"
            class="transition-colors hover:text-indigo-400"
            >GitHub</a
          >
          <a
            href="https://www.npmjs.com/package/rivu"
            class="transition-colors hover:text-indigo-400"
            >npm</a
          >
        </div>
      </nav>
    </header>

    <div
      class="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 md:flex-row lg:px-8"
    >
      <aside class="w-full shrink-0 md:w-56">
        <nav class="space-y-6 text-sm" aria-label="Documentation">
          <template v-for="section in sections" :key="section.path">
            <div v-if="section.children?.length">
              <p
                class="mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase"
              >
                {{ section.title }}
              </p>
              <ul class="space-y-1">
                <li v-for="child in section.children" :key="child.path">
                  <NuxtLink
                    :to="child.path"
                    class="block rounded-md px-3 py-1.5 text-slate-400 transition-colors hover:text-slate-100"
                    active-class="bg-slate-800 text-indigo-400"
                  >
                    {{ child.title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
            <NuxtLink
              v-else
              :to="section.path"
              class="block rounded-md px-3 py-1.5 font-medium text-slate-300 transition-colors hover:text-slate-100"
              active-class="bg-slate-800 text-indigo-400"
            >
              {{ section.title }}
            </NuxtLink>
          </template>
        </nav>
      </aside>

      <main class="min-w-0 flex-1">
        <article v-if="page" class="min-w-0 overflow-x-hidden">
          <h1 class="text-3xl font-extrabold tracking-tight text-white">
            {{ page.title }}
          </h1>
          <p class="mt-2 text-lg text-slate-400">{{ page.description }}</p>
          <div class="prose mt-8">
            <ContentRenderer :value="page" />
          </div>
        </article>

        <nav
          class="mt-16 flex items-center justify-between gap-4 border-t border-slate-800 pt-6 text-sm"
          aria-label="Pagination"
        >
          <NuxtLink
            v-if="previous"
            :to="previous.path"
            class="rounded-lg border border-slate-800 px-4 py-3 text-slate-300 transition-colors hover:border-indigo-500/40 hover:text-indigo-400"
          >
            <span class="block text-xs text-slate-500">Previous</span>
            {{ previous.title }}
          </NuxtLink>
          <span v-else />
          <NuxtLink
            v-if="next"
            :to="next.path"
            class="rounded-lg border border-slate-800 px-4 py-3 text-right text-slate-300 transition-colors hover:border-indigo-500/40 hover:text-indigo-400"
          >
            <span class="block text-xs text-slate-500">Next</span>
            {{ next.title }}
          </NuxtLink>
        </nav>
      </main>
    </div>
  </div>
</template>

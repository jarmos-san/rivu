<script setup lang="ts">
  import { ref } from "vue";

  import { useSeoMeta } from "#imports";

  useSeoMeta({
    title: "rivu - RSS 2.0 Feed Generator for TypeScript",
    description:
      "A lightweight, type-safe RSS 2.0 feed generator for Node.js and modern JavaScript runtimes.",
  });

  const activePackageManager = ref<"pnpm" | "npm" | "yarn" | "bun">("pnpm");
  const copied = ref(false);

  const packageManagers = {
    pnpm: "pnpm add rivu",
    npm: "npm install rivu",
    yarn: "yarn add rivu",
    bun: "bun add rivu",
  };

  function copyCmd(): void {
    navigator.clipboard.writeText(packageManagers[activePackageManager.value]);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
</script>

<template>
  <div
    class="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30"
  >
    <header class="border-b border-slate-800/80">
      <nav
        class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
      >
        <NuxtLink to="/" class="font-mono text-lg font-bold text-white">
          rivu
        </NuxtLink>
        <div class="flex items-center space-x-6 text-sm text-slate-400">
          <NuxtLink
            to="/docs/getting-started"
            class="transition-colors hover:text-indigo-400"
            >Docs</NuxtLink
          >
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

    <main class="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div class="space-y-8 text-center">
        <span
          class="inline-flex items-center rounded-md border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400"
        >
          TypeScript RSS 2.0 Library
        </span>

        <h1
          class="mx-auto max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-6xl"
        >
          RSS 2.0 feeds,
          <span
            class="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            >typed</span
          >.
        </h1>

        <p class="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
          Type-safe RSS 2.0 output with zero config. Dates become RFC 822, CDATA
          is handled for you, and a self link and stylesheet are one option
          away. One dependency: xmlbuilder2.
        </p>

        <div
          class="mx-auto max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-2 shadow-xl"
        >
          <div
            class="mb-2 flex items-center justify-center space-x-1 border-b border-slate-800 pb-2"
          >
            <button
              v-for="(cmd, pm) in packageManagers"
              :key="pm"
              @click="activePackageManager = pm"
              :class="[
                'rounded-md px-3 py-1 font-mono text-xs font-medium uppercase transition-colors',
                activePackageManager === pm
                  ? 'border border-slate-700 bg-slate-800 text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200',
              ]"
            >
              {{ pm }}
            </button>
          </div>
          <div
            class="flex items-center justify-between px-3 py-1 font-mono text-sm text-slate-200"
          >
            <span>{{ packageManagers[activePackageManager] }}</span>
            <button
              @click="copyCmd"
              class="text-xs text-slate-400 transition-colors hover:text-indigo-400"
            >
              {{ copied ? "Copied!" : "Copy" }}
            </button>
          </div>
        </div>

        <div>
          <NuxtLink
            to="/docs/getting-started"
            class="inline-flex items-center rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
          >
            Read the docs
          </NuxtLink>
        </div>
      </div>

      <div class="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:rss" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            Typed RSS 2.0 Output
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Describe a channel and its items as plain objects and get an RSS 2.0
            document back from generate().
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:zap" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            Dates Done Right
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Pass a Date and get an RFC 822 string. Fields you leave out are
            omitted, never emitted empty.
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:shield-check" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            Type-Safe by Default
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Exported types for channel elements, items and options catch typos
            and wrong shapes in your editor.
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:list-checks" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            CDATA Handled
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Titles and descriptions are always CDATA. Other fields use CDATA
            when they contain markup and are escaped otherwise.
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:tag" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            Self Link and Stylesheet
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Add an Atom self link with feedURL and an XSL or CSS stylesheet with
            stylesheet. Both are optional.
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6">
          <div
            class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400"
          >
            <Icon name="lucide:feather" class="h-5 w-5" />
          </div>
          <h3 class="mb-2 text-base font-semibold text-slate-200">
            Zero Config, One Dependency
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Create a Feed and call generate(). The only runtime dependency is
            xmlbuilder2.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

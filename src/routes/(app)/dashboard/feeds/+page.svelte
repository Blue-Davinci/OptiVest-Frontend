<script>
	import Pagination from '$lib/layouts/common/pagination.svelte';
	import LoaderSpinner from '$lib/layouts/common/loaderspinner.svelte';
	import SkeletonCard from '$lib/layouts/common/skeletoncard.svelte';
	import { TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS } from '$lib/settings/constants.js';
	import { toastManager } from '$lib/helpers/utilities.js';
	import {
		addPostToFavorite,
		removePostFromFavorite,
		getFeeds
	} from '$lib/dataservice/feeds/feedsDataService.js';
	import { Search, Bell, Menu, Bookmark } from 'lucide-svelte';
	import FeedCard from '$lib/layouts/feeds/feedcard.svelte';
	import UserMenu from '$lib/layouts/feeds/usermenu.svelte';

	let { data } = $props();
	let feedPosts = $derived(data?.feedData?.data?.posts ?? []);

	// metadata
	let currentPage = data?.feedData?.data?.metadata?.current_page ?? 0;
	let pageSize = data?.feedData?.data?.metadata?.page_size ?? 0;
	let totalRecords = data?.feedData?.data?.metadata?.total_records ?? 0;
	let totalPages = Math.ceil(totalRecords / pageSize);

	let userInfo = data?.userInformation;
	let searchQuery = $state('');
	let selectedFilter = $state('all');
	let showUserMenu = $state(false);
	let isLoading = $state(false); // Loading state

	function getFilteredPosts() {
		return feedPosts.filter((post) => {
			const matchesSearch =
				post.rss_feed.Channel.Item[0].Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				post.rss_feed.Channel.Item[0].Content.toLowerCase().includes(searchQuery.toLowerCase());

			if (selectedFilter === 'all') return matchesSearch;
			if (selectedFilter === 'favorited') return matchesSearch && post.is_favorited;
			return matchesSearch;
		});
	}

	function handleFavorite(postId, feed_id) {
		const post = data.feedData.data.posts.find((post) => post.rss_feed.id === postId);
		if (!post) return;

		const isAddingLike = !post.is_favorited;
		isAddingLike ? sendLikeRequest(postId, feed_id) : sendUnlikeRequest(postId);
	}

	async function sendLikeRequest(postId, feed_id) {
		let result = await addPostToFavorite(postId, feed_id);
		if (result.success) {
			updateData(postId);
			toastManager(TOAST_TYPE_SUCCESS, 'Successfully added to favorites');
		} else {
			toastManager(
				TOAST_TYPE_ERROR,
				result.error.post_id ? result.error.post_id : 'Failed to add to favorites'
			);
		}
	}

	async function sendUnlikeRequest(postId) {
		let result = await removePostFromFavorite(postId);
		if (result.success) {
			updateData(postId);
			toastManager(TOAST_TYPE_SUCCESS, 'Successfully removed from favorites');
		} else {
			toastManager(
				TOAST_TYPE_ERROR,
				result.error.post_id ? result.error.post_id : 'Failed to remove from favorites'
			);
		}
	}

	function updateData(postId) {
		data = {
			...data,
			feedData: {
				...data.feedData,
				data: {
					...data.feedData.data,
					posts: data.feedData.data.posts.map((post) =>
						post.rss_feed.id === postId ? { ...post, is_favorited: !post.is_favorited } : post
					)
				}
			}
		};
	}

	function handlePageChange(page) {
		fetchData(page, searchQuery);
	}

	async function fetchData(page, query = '') {
		isLoading = true; // Start loading indicator
		try {
			const response = await getFeeds({}, page, pageSize, query);
			if (!response.success) {
				data = {
					...data,
					feedData: {
						...data.feedData,
						data: {
							...data.feedData.data,
							posts: []
						}
					}
				};
				return;
			}
			data = {
				...data,
				feedData: {
					...data.feedData,
					data: {
						...data.feedData.data,
						metadata: response.data.metadata,
						posts: response.data.posts
					}
				}
			};
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false; // Stop loading indicator
		}
	}

	function handleToggleMenu() {
		showUserMenu = !showUserMenu;
	}
</script>

<div class="min-h-screen bg-gray-50 transition-colors duration-200 dark:bg-gray-900">
    <div class="sticky top-0 z-50 border-b border-gray-200 bg-white bg-opacity-80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-800">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between py-4">
                <div class="flex items-center gap-4">
                    <UserMenu {userInfo} showMenu={showUserMenu} onToggleMenu={handleToggleMenu} />
                </div>

                <div class="flex items-center gap-3">
                    <button
                        class="relative rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        aria-label="Notifications"
                    >
                        <div class="h-6 w-6">
                            <Bell />
                        </div>
                        <span class="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                    <button
                        class="rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 md:hidden"
                        aria-label="Menu"
                    >
                        <div class="h-6 w-6">
                            <Menu />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="mb-8 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h1 class="mb-6 flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
                Your RSS Feed
                <span class="rounded-full bg-blue-100 px-3 py-1 text-sm font-normal text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                    {getFilteredPosts().length} posts
                </span>
            </h1>

            <div class="flex flex-col gap-6 lg:flex-row">
                <div class="relative flex-1">
                    <div class="group relative">
                        <input
                            type="text"
                            bind:value={searchQuery}
                            placeholder="Search feeds..."
                            class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400"
                        />
                        <div class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 dark:text-gray-500">
                            <Search />
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-4">
                    <select
                        bind:value={selectedFilter}
                        class="rounded-xl border border-gray-200 bg-gray-50 px-6 py-3.5 text-gray-900 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                    >
                        <option value="all">All Posts</option>
                        <option value="favorited">Favorited</option>
                    </select>
                </div>
            </div>
        </div>

        {#if isLoading}
            <div class="fixed bottom-8 right-8 z-50">
                <div class="flex items-center space-x-3 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
                    <LoaderSpinner size={"w-6 h-6"} />
                    <span class="text-gray-700 dark:text-gray-300">Loading more posts...</span>
                </div>
            </div>
            <div class="w-full">
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {#each Array(6) as _, i (i)}
                        <div class="w-full">
                            <SkeletonCard />
                        </div>
                    {/each}
                </div>
            </div>
        {:else}
            {#if getFilteredPosts().length === 0}
                <div class="rounded-2xl bg-white py-16 text-center shadow-lg dark:bg-gray-800">
                    <div class="mx-auto max-w-md">
                        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                            <div class="h-8 w-8 text-gray-400 dark:text-gray-500">
                                <Bookmark />
                            </div>
                        </div>
                        <h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No posts found</h3>
                        <p class="text-gray-500 dark:text-gray-400">
                            Try adjusting your search or filter criteria to find what you're looking for.
                        </p>
                    </div>
                </div>
            {:else}
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {#each getFilteredPosts() as post (post.rss_feed.id)}
                        <FeedCard {post} onFavorite={handleFavorite} />
                    {/each}
                </div>
            {/if}
        {/if}
        <div class="mt-8">
            <Pagination {totalPages} {pageSize} {totalRecords} {handlePageChange} />
        </div>
    </div>
</div>

<style>
    :global(html) {
        scroll-behavior: smooth;
    }

    :global(::-webkit-scrollbar) {
        width: 8px;
    }

    :global(::-webkit-scrollbar-track) {
        background: transparent;
    }

    :global(::-webkit-scrollbar-thumb) {
        background: #cbd5e1;
        border-radius: 4px;
    }

    :global(::-webkit-scrollbar-thumb:hover) {
        background: #94a3b8;
    }

    @media (prefers-color-scheme: dark) {
        :global(::-webkit-scrollbar-thumb) {
            background: #475569;
        }

        :global(::-webkit-scrollbar-thumb:hover) {
            background: #64748b;
        }
    }
</style>
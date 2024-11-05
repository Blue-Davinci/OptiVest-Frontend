<script>
    import { Check, Trash2, ExternalLink } from 'lucide-svelte';

    let { notification, type = 'new', onMarkAsRead, onDelete } = $props();

    function formatDate(dateString) {
        try{
            const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            month: 'short',
            day: 'numeric'
        }).format(date);
        }catch(e){
            return dateString;
        }
    }

    function getNotificationTypeStyles(notificationType) {
        const baseClasses = "absolute left-0 top-0 h-full w-1 rounded-l-xl";
        switch (notificationType) {
            case 'alert':
                return `${baseClasses} bg-red-500`;
            case 'info':
                return `${baseClasses} bg-blue-500`;
            default:
                return `${baseClasses} bg-purple-500`;
        }
    }
</script>

<div 
    class="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-800/90 
    {type === 'new' && notification.status === 'read' ? 'bg-gray-50 dark:bg-gray-800/70' : ''}"
    style="transform-origin: center;"
    role="listitem"
>
    <!-- Notification Type Indicator -->
    <div class={getNotificationTypeStyles(notification.notification_type)}></div>

    <!-- Background Gradient -->
    <div 
        class="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 
        dark:from-purple-900/5 dark:to-transparent"
    ></div>

    <!-- Header -->
    <div class="relative mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2">
                {#if type === 'new' && notification.status !== 'read'}
                    <span class="flex h-2 w-2">
                        <span class="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-purple-400 opacity-75"></span>
                        <span class="relative inline-flex h-2 w-2 rounded-full bg-purple-500"></span>
                    </span>
                {/if}
                <span class="font-medium text-gray-900 dark:text-white">
                    #{type === 'new' ? notification.notification_id : notification.id}
                </span>
            </div>
            <time class="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(type === 'new' ? notification.sent_at : notification.created_at)}
            </time>
        </div>

        <div class="flex items-center gap-2 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100">
            {#if type === 'new' && notification.status !== 'read'}
                <button 
                    onclick={() => onMarkAsRead?.(notification.notification_id)}
                    class="rounded-full p-2 text-gray-500 transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 hover:shadow-md dark:text-gray-400 dark:hover:bg-purple-900/20 dark:hover:text-purple-400"
                    title="Mark as read"
                >
                    <Check class="h-5 w-5" />
                </button>
            {/if}
            <button 
                onclick={() => onDelete?.(type === 'new' ? notification.notification_id : notification.id)}
                class="rounded-full p-2 text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-500 hover:shadow-md dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                title="Delete notification"
            >
                <Trash2 class="h-5 w-5" />
            </button>
        </div>
    </div>

    <!-- Content -->
    <div class="relative space-y-4">
        <p class="leading-relaxed text-gray-700 dark:text-gray-200">
            {notification.message}
        </p>

        {#if notification.meta?.url}
            <a 
                href={notification.meta.url}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-purple-600 transition-all duration-200 hover:text-purple-700 hover:underline dark:text-purple-400 dark:hover:text-purple-300"
            >
                <ExternalLink class="h-4 w-4" />
                <span>View details</span>
            </a>
        {/if}

        {#if notification.meta?.image_url}
            <div class="group/image relative overflow-hidden rounded-lg">
                <img 
                    src={notification.meta.image_url}
                    alt="Notification attachment"
                    class="max-h-48 w-full rounded-lg object-cover shadow-md transition-all duration-300 group-hover/image:scale-105"
                    loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover/image:opacity-100"></div>
            </div>
        {/if}
    </div>
</div>
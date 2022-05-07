#include "discordcoreapi/Index.hpp"
#include "Commands/CommandsList.hpp"
#include "Credentials.hpp"

int main()
{
    std::unique_ptr<DiscordCoreAPI::DiscordCoreClient> clientPtr = std::make_unique<DiscordCoreAPI::DiscordCoreClient>(
        Credentials::token,
        std::vector<DiscordCoreAPI::RepeatedFunctionData>{},
        DiscordCoreAPI::CacheOptions{.cacheGuildMembers = true, .cacheChannels = true, .cacheGuilds = true, .cacheRoles = true, .cacheUsers = true},
        DiscordCoreAPI::ShardingOptions{},
        DiscordCoreAPI::LoggingOptions{});
    clientPtr->registerFunction(std::vector<std::string> {"test"}, std::make_unique<DiscordCoreAPI::Test>());
    clientPtr->runBot();

    return 0;
}

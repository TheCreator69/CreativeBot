#include "discordcoreapi/Index.hpp"
#include "Commands/CommandsList.hpp"
#include <fstream>

std::string readBotToken()
{
    std::string token = "";

    std::fstream stream;
    stream.open("credentials.txt", std::ios::in);
    if (stream.is_open())
    {
        std::getline(stream, token);
        stream.close();
    }
    return token;
}

int main()
{
    std::string botToken = readBotToken();

    std::unique_ptr<DiscordCoreAPI::DiscordCoreClient> clientPtr = std::make_unique<DiscordCoreAPI::DiscordCoreClient>(
        botToken,
        std::vector<DiscordCoreAPI::RepeatedFunctionData>{},
        DiscordCoreAPI::CacheOptions{.cacheGuildMembers = true, .cacheChannels = true, .cacheGuilds = true, .cacheRoles = true, .cacheUsers = true},
        DiscordCoreAPI::ShardingOptions{},
        DiscordCoreAPI::LoggingOptions{});
    clientPtr->registerFunction(std::vector<std::string> {"test"}, std::make_unique<DiscordCoreAPI::Test>());
    clientPtr->runBot();

    return 0;
}

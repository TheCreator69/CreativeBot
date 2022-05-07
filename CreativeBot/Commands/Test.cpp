#include "Test.hpp"

namespace DiscordCoreAPI
{
	Test::Test()
	{
		this->commandName = "test";
		this->helpDescription = "This is a test description.";
		DiscordCoreAPI::EmbedData msgEmbed;
		msgEmbed.setDescription("------\nSimply enter /test!\n------");
		msgEmbed.setTitle("__**Test Usage:**__");
		msgEmbed.setTimeStamp(getTimeAndDate());
		msgEmbed.setColor("FeFeFe");
		this->helpEmbed = msgEmbed;
	}

	std::unique_ptr<DiscordCoreAPI::BaseFunction> Test::create()
	{
		return std::make_unique<Test>();
	}

	void Test::execute(DiscordCoreAPI::BaseFunctionArguments& args)
	{
		DiscordCoreAPI::InputEvents::deleteInputEventResponseAsync(args.eventData);

		DiscordCoreAPI::RespondToInputEventData dataPackage{ args.eventData };
		dataPackage.addContent("Test Message!");
		dataPackage.setResponseType(DiscordCoreAPI::InputEventResponseType::Interaction_Response);

		DiscordCoreAPI::InputEvents::respondToEventAsync(dataPackage);
	}
}
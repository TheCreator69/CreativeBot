#pragma once

#include "discordcoreapi/Index.hpp"

namespace DiscordCoreAPI
{

	class Test : public DiscordCoreAPI::BaseFunction
	{
	public:
		Test()
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

		std::unique_ptr<DiscordCoreAPI::BaseFunction> create()
		{
			return std::make_unique<Test>();
		}

		virtual void execute(DiscordCoreAPI::BaseFunctionArguments& args)
		{
			DiscordCoreAPI::InputEvents::deleteInputEventResponseAsync(args.eventData);

			DiscordCoreAPI::RespondToInputEventData dataPackage{args.eventData};
			dataPackage.addContent("Test Message!");
			dataPackage.setResponseType(DiscordCoreAPI::InputEventResponseType::Interaction_Response);

			DiscordCoreAPI::InputEvents::respondToEventAsync(dataPackage);
		}
	};
}
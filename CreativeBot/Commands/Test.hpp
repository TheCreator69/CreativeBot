#pragma once

#include "discordcoreapi/Index.hpp"

namespace DiscordCoreAPI
{

	class Test : public DiscordCoreAPI::BaseFunction
	{
	public:
		Test();

		std::unique_ptr<DiscordCoreAPI::BaseFunction> create();

		virtual void execute(DiscordCoreAPI::BaseFunctionArguments& args);
	};
}
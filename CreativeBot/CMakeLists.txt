# CMake 3.12 required for C++20 support
cmake_minimum_required(VERSION 3.18)

# Set project name - defines the name of the Visual Studio solution file on Windows (CreativeBot.sln)
project(CreativeBot)

# C++20 standard needs to be explicitely set since DiscordCoreAPI requires it
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Create a "CMakePredefinedTargets" folder and throw CMake projects like ZERO_CHECK and ALL_BUILD in there
set_property(GLOBAL PROPERTY USE_FOLDERS ON)

# Gather files to show up in IDE
file(GLOB COMMAND_SOURCES "Commands/*.hpp" "Commands/*.cpp")
set(SOURCE_FILES "Main.cpp" "Credentials.hpp" "CMakeLists.txt" ${COMMAND_SOURCES})

# Defines source folder tree starting from project root for IDEs
source_group(TREE "${CMAKE_CURRENT_SOURCE_DIR}" PREFIX "Source Files" FILES ${SOURCE_FILES})

# All files need to be added, otherwise they don't show up in IDEs for some reason
add_executable(CreativeBot ${SOURCE_FILES})
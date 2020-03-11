/**
 * Copyright (c) 2019-2020. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

#include <algorithm>

#include "ActivityWMS.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(FileCopyWMS, "Log category for FileCopyWMS");

namespace wrench {
    ActivityWMS::ActivityWMS(const std::set<std::shared_ptr<StorageService>> &storage_services,
                             const std::string &hostname)
            : WMS(nullptr, nullptr, {}, storage_services, {}, nullptr, hostname, "activity0") {

    }

    int ActivityWMS::main() {

        this->data_movement_manager = this->createDataMovementManager();

        auto storage_services = this->getAvailableStorageServices();

        auto storage_service_1 = std::find_if(
                storage_services.begin(),
                storage_services.end(),
                [](std::shared_ptr<StorageService> ss) {
                    return ss->getHostname() ==
                           "host1";
                });

        auto storage_service_2 = std::find_if(
                storage_services.begin(),
                storage_services.end(),
                [](std::shared_ptr<StorageService> ss) {
                    return ss->getHostname() ==
                           "host2";
                });

        for (auto const &file : this->getWorkflow()->getFiles()) {
            this->data_movement_manager->initiateAsynchronousFileCopy(file,
                                                                      FileLocation::LOCATION(*storage_service_1, "/"),
                                                                      FileLocation::LOCATION(*storage_service_2, "/"),
                                                                      nullptr);
        }

        for (auto const &file: this->getWorkflow()->getFiles()) {
            this->waitForAndProcessNextEvent();
        }

        return 0;
    }
}

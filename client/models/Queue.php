<?php

namespace models;


use lib\Object;

class Queue extends Object
{
    /**
     * @var QueueItem[]
     */
    public $buildingItems = [];
    /**
     * @var QueueItem[]
     */
    public $shipItems = [];
    /**
     * @var QueueItem[]
     */
    public $techItems = [];

    public function __construct(array $queueMsg)
    {
        
        foreach ($queueMsg['building'] as $id => $item) {
            $this->buildingItems[$id] = new QueueItem($item);
        }
        foreach ($queueMsg['tech'] as $id => $item) {
            $this->techItems[$id] = new QueueItem($item);
        }
        foreach ($queueMsg['ship'] as $id => $item) {
            $this->shipItems[$id] = new QueueItem($item);
        }
        
        parent::__construct();
    }

    /**
     * @return bool
     */
    public function isEmpty(){
        return empty($this->buildingItems) && empty($this->shipItems) && empty($this->techItems);
    }
    
    public function dump(){
        
        echo PHP_EOL, ' -- Building Queue--', PHP_EOL;
        if (empty($this->buildingItems)) {
            echo 'No building in construction.', PHP_EOL;
        } else {
            foreach ($this->buildingItems as $id => $item) {
                echo $item, PHP_EOL;
            }
        }

        echo PHP_EOL, ' -- Ship Queue --', PHP_EOL;
        if (empty($this->shipItems)) {
            echo 'No ship in manufacturing.', PHP_EOL;
        } else {
            foreach ($this->shipItems as $id => $item) {
                echo $item, PHP_EOL;
            }
        }

        echo PHP_EOL, ' -- Tech Queue --', PHP_EOL;
        if (empty($this->techItems)) {
            echo 'No tech in research.', PHP_EOL;
        } else {
            foreach ($this->techItems as $id => $item) {
                echo $item, PHP_EOL;
            }
        }
        
    }
}
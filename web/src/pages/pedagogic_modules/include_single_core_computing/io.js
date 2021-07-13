import React, { useState, useEffect } from "react"
import { Accordion, Divider, Header, Icon, Segment, Table } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import IOSimulation from "./io_simulation"
import "./../pedagogic_modules.css"

import IOFigure1 from "../../../images/svgs/IO_figure_1.svg"
import IOFigure2 from "../../../images/svgs/IO_figure_2.svg"
import IOFigure3 from "../../../images/svgs/IO_figure_3.svg"
import IOFigure4 from "../../../images/svgs/IO_figure_4.svg"
import IOFigure5 from "../../../images/svgs/IO_figure_5.svg"

const IO = () => {
  const [auth, setAuth] = useState("false")
  const [test, setTest] = useState([])

  useEffect(() => {
    const authenticated = localStorage.getItem("login")
    setAuth(authenticated)
  })

  return (
    <>
      <Segment.Group className="objectives">
        <Segment inverted><strong>Learning Objectives</strong></Segment>
        <Segment style={{ backgroundColor: "#fafafa" }}>
          <ul style={{ backgroundColor: "#fafafa" }}>
            <li>Understand the concept of IO</li>
            <li>Understand the impact of IO operations on computing</li>
            <li>Understand the basics of optimizing computation around IO operations</li>
          </ul>
        </Segment>
      </Segment.Group>

      <h2>Basic Concepts</h2>

      <p>
        A computer typically does not run a program start to finish in a vacuum. Programs often need to
        consume <strong>I</strong>nput and produce <strong>O</strong>utput, which is done by executing <strong>IO
        operations</strong>. A couple of very common IO operations are reading from disk and writing to disk. As the
        disk is much slower than the CPU, even small disk reads or writes can represent a large (from the CPU’s
        perspective) chunk of time during which the CPU is sitting idle.
      </p>

      <p>
        When it comes to IO operations, not all programs are created equal. Some programs will require more IO time than
        others. In fact, programs are typically categorized as IO- or CPU-intensive. If a program spends more time
        performing IO operations than CPU operations, it is said to be <i>IO-intensive</i>. If the situation is
        reversed, the program is said to be <i>CPU-intensive</i>. For instance, a program that reads a large jpeg image
        from disk, reduces the brightness of every pixel (to make the image darker), and writes the modified image to
        disk is IO-intensive on most standard computers (a lot of data to read/write from/to disk, and very quick
        computation on this data – in this case perhaps just a simple subtraction). By contrast, a program that instead
        of reducing the brightness of the image applies an oil painting filter to it will most likely be CPU-intensive
        (applying an oil painting filter entails many, many more computations than a simple subtraction).
      </p>

      <p>
        As mentioned above, reading from and writing to the disk are slow operations compared to the CPU. Typically,
        there is a difference between read and write speeds as well. Reading is typically significantly faster than
        writing. Furthermore, different kinds of disks have different speeds as well. The table below shows advertised
        read and write speeds for two mass-market SATA disks, a Hard Disk Drive (HDD) and a Solid State Drive (SSD), at
        the time this content is being written:
      </p>

      <Table collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Disk</Table.HeaderCell>
            <Table.HeaderCell>Read Bandwidth</Table.HeaderCell>
            <Table.HeaderCell>Write Bandwidth</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>WD HDD (10EZEX)</Table.Cell>
            <Table.Cell>160 MB/sec</Table.Cell>
            <Table.Cell>143 MB/sec</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Samsung 860 EVO</Table.Cell>
            <Table.Cell>550 MB/sec</Table.Cell>
            <Table.Cell>520 MB/sec</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="3">
              The read and write speeds are often referred to as <strong>bandwidths</strong>. The units above is MB/sec
              (MegaByte per second), which is also written as MBps.
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>

      <p>
        Determining the exact bandwidth that disk reads and writes will experience during program execution is actually
        difficult (due to the complexity of the underlying hardware and software, and due to how the data is stored and
        accessed on the disk). In this module, we will always assume that disk bandwidths are constant.
      </p>

      <h2>A Program with Computation and IO</h2>

      <p>
        Let us consider a program that performs a task in three phases. First, it reads data from disk. Second, it
        performs some computation on that data to create new data. And third, it writes the new data back to disk. This
        could be one of the image processing programs mentioned in the previous section as examples. If this program is
        invoked to process two images, i.e., so that it performs two tasks, then its execution timeline is as depicted
        below:
      </p>

      <IOFigure1 />
      <div className="caption"><strong>Figure 1:</strong> Example execution timeline.</div>

      <p>
        As can be seen in the figure, at any given time either the CPU is idle (while IO operations are ongoing) or the
        disk is idle (while computation is ongoing). In the above figure, reading an image from disk takes 1 second,
        writing an image to disk takes 1 second, and processing an image takes 2 seconds. (We can thus infer that the
        two images have the same size, and that the disk has identical read and write bandwidths). We can compute the
        CPU Utilization as follows:
      </p>

      <TeX block math="\text{CPU Utilization}  = \frac{T_{Compute}}{T_{Compute} + T_{Idle}} = \frac{4}{4 + 4} = 0.5" />

      <p>
        This means that the CPU is idle for half of the execution of the program. This program is perfectly balanced,
        i.e., it is neither CPU-intensive nor IO-intensive.
      </p>

      <h2>Overlapping computation and IO</h2>

      <p>
        The execution in the previous section can be improved. This is because <strong>the CPU and the disk are two
        different hardware components, and they can work at the same time</strong>. As a result, while the CPU is
        processing the 1st image, the 2nd image could be read from disk! The CPU can then start processing the 2nd image
        right away after it finishes processing the 1st image. The 1st image can be written to disk at the same time.
        This execution is depicted below:
      </p>

      <IOFigure2 />
      <div className="caption"><strong>Figure 2:</strong> Example execution timeline with overlap of IO and computation.
      </div>

      <p>
        The total execution time has dropped by 2 seconds <strong>and</strong> the CPU utilization is increased:
      </p>

      <TeX block math="\text{CPU Utilization} = \frac{T_{Compute}}{T_{Compute} + T_{Idle}} = \frac{4}{4 + 2} = 0.66" />

      <p>
        If there were additional, similar images to process, the CPU utilization would continue to drop as it would be
        idle only at the very beginning and at the very end of the execution.
      </p>

      <p>
        The above is an ideal situation because IO time for an image is exactly equal to compute time. More precisely,
        save for the first and last task, <i>while the program computes task <TeX math="i" /> there is enough time to
        write the output of task <TeX math="i-1" /> and to read the input of task <TeX math="i+1" /></i>.
      </p>

      <p>
        If the above condition does not hold, then there is necessarily CPU idle time. For instance, if the time to read
        an image is instead 2s (for instance because the program reads larger images but writes back down-scaled images)
        and the program must process 3 images, then the execution would be as:
      </p>

      <IOFigure3 />
      <div className="caption"><strong>Figure 3:</strong> Example execution timeline with overlap of IO and computation.
      </div>

      <p>
        As expected, the program first reads 2 images, and then alternates write and read operations while CPU
        computation is going on. But in this case, the CPU experiences idle time because images cannot be read from disk
        fast enough. So although overlapping IO and computation almost always reduces program execution time, the
        benefit can vary based on IO and computation volumes (and especially if these volumes vary from task to task!).
      </p>

      <Divider />

      <h2>Practical concerns</h2>

      <p>
        In practice, one can implement a program that overlaps IO and computation. This can be done by using
        non-blocking IO operations and/or threads. These are techniques that are described in Operating Systems
        <a href="/textbooks">textbooks</a>. The overlap may not be completely "free", as reading/writing data from disk
        can still require the CPU to perform some computation. Therefore, there can be time-sharing of the CPU between
        the IO operations and the computation, and the computation is slowed down a little bit by the IO operations
        (something we did not show in the figures above). This said, there are ways for IO operations to use almost no
        CPU cycles. One such technique, which relies on specific but commonplace hardware, is called Direct Memory
        Access (DMA). See Operating Systems <a href="/textbooks">textbooks</a> for more details.
      </p>

      <p>
        Another practical concern is RAM pressure. When going from the example execution in Figure 1 to that in Figure
        2, the peak amount of RAM needed by the program is increased because at some point more than one input images
        are held in RAM. Since tasks could have significant memory requirements, RAM constrains can prevent some overlap
        of IO and computation.
      </p>

      <Header as="h3" block>
        Simulating IO
      </Header>

      <p>
        So that you can gain hands-on experience with the above concepts, use the simulation app below.
      </p>

      <p>
        Initially, you can create a series of identical tasks that have a certain input and output. Run the simulation
        to see the progression of tasks and host utilization without allowing IO to overlap with computation. Once you
        have observed this, try selecting the checkbox to allow overlap. With IO overlap there should be an improvement
        in execution time and host utilization. You can view this in the output graphs that are generated. You can also
        try varying the input/output and computation amounts to create IO-intensive or CPU-intensive tasks.
        Understanding which tasks will benefit from increased R/W or computation speeds will assist you in answering the
        questions to come.
      </p>

      <Accordion styled className="simulation" defaultActiveIndex={-1} fluid panels={[{
        title: "Simulation Activity",
        content: {
          content: (<IOSimulation />)
        }
      }]}>

      </Accordion>

      {/*<IOFigure4 />*/}
      {/*<IOFigure5 />*/}


      {/*<Card className="main">*/}
      {/*  <Card.Body className="card">*/}
      {/*    <Accordion>*/}
      {/*      <Card>*/}
      {/*        <Accordion.Toggle as={Card.Header} eventKey="0">*/}
      {/*          (Open Simulator Here)*/}
      {/*        </Accordion.Toggle>*/}
      {/*        <Accordion.Collapse eventKey="0">*/}
      {/*          <Card.Body className="card">*/}
      {/*            {auth === "true" ? (*/}
      {/*            ) : (*/}
      {/*              <div className="card">*/}
      {/*                <img*/}
      {/*                  src={require("../../../images/wrench_logo.png")}*/}
      {/*                  width="40"*/}
      {/*                  height="40"*/}
      {/*                  style={{*/}
      {/*                    backgroundColor: "white"*/}
      {/*                  }}*/}
      {/*                  alt="eduWRENCH logo"*/}
      {/*                />*/}
      {/*                <h4 className="card" style={{ color: "grey" }}>*/}
      {/*                  {" "}*/}
      {/*                  eduWRENCH Pedagogic Module Simulator*/}
      {/*                </h4>*/}
      {/*                <p className="card">*/}
      {/*                  <b className="card">*/}
      {/*                    Sign in on the top of the page to access the*/}
      {/*                    simulator.*/}
      {/*                  </b>*/}
      {/*                </p>*/}
      {/*              </div>*/}
      {/*            )}*/}
      {/*          </Card.Body>*/}
      {/*        </Accordion.Collapse>*/}
      {/*      </Card>*/}
      {/*    </Accordion>*/}
      {/*  </Card.Body>*/}
      {/*</Card>*/}
    </>
  )
}

export default IO

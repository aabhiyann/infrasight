import {
  Box,
  Flex,
  Text,
  Stack,
  Container,
  Button,
  Card,
} from "../components/ui";

/**
 * Example demonstrating the new reusable component library
 * This shows how to build UIs using the design system instead of inline styles
 */
const ComponentLibraryExample = () => {
  return (
    <Container maxWidth="xl" p="lg">
      <Stack spacing="xl">
        {/* Page Header */}
        <Box>
          <Text as="h1" fontSize="3xl" fontWeight="bold" mb="sm">
            Component Library Examples
          </Text>
          <Text color="muted" fontSize="lg">
            Demonstrating reusable components with design system integration
          </Text>
        </Box>

        {/* Layout Examples */}
        <Card>
          <Text as="h2" fontSize="2xl" fontWeight="semibold" mb="lg">
            Layout Components
          </Text>

          <Stack spacing="lg">
            {/* Flex Example */}
            <Box>
              <Text fontSize="lg" fontWeight="medium" mb="md">
                Flex Component
              </Text>
              <Flex
                justify="space-between"
                align="center"
                p="md"
                className="flex-1 min-w-[200px] border border-gray-200 rounded-lg"
              >
                <Text>Left Content</Text>
                <Text>Right Content</Text>
              </Flex>
            </Box>

            {/* Stack Example */}
            <Box>
              <Text fontSize="lg" fontWeight="medium" mb="md">
                Stack Component
              </Text>
              <Stack
                spacing="md"
                p="md"
                className="flex-1 min-w-[200px] border border-gray-200 rounded-lg"
              >
                <Text>Item 1</Text>
                <Text>Item 2</Text>
                <Text>Item 3</Text>
              </Stack>
            </Box>

            {/* Box with Spacing */}
            <Box>
              <Text fontSize="lg" fontWeight="medium" mb="md">
                Box with Spacing Props
              </Text>
              <Box
                p="lg"
                m="md"
                className="bg-blue-50 border border-blue-200 rounded-lg"
              >
                <Text>This box has padding and margin applied via props</Text>
              </Box>
            </Box>
          </Stack>
        </Card>

        {/* Typography Examples */}
        <Card>
          <Text as="h2" fontSize="2xl" fontWeight="semibold" mb="lg">
            Typography Components
          </Text>

          <Stack spacing="md">
            <Text as="h1" fontSize="4xl" fontWeight="bold">
              Heading 1
            </Text>
            <Text as="h2" fontSize="3xl" fontWeight="semibold">
              Heading 2
            </Text>
            <Text as="h3" fontSize="2xl" fontWeight="medium">
              Heading 3
            </Text>
            <Text fontSize="lg" color="muted">
              Regular text with muted color
            </Text>
            <Text fontSize="sm" color="danger">
              Small text with danger color
            </Text>
            <Text fontSize="xs" color="success" truncate>
              Truncated text that will be cut off if too long
            </Text>
          </Stack>
        </Card>

        {/* Button Examples */}
        <Card>
          <Text as="h2" fontSize="2xl" fontWeight="semibold" mb="lg">
            Button Components
          </Text>

          <Flex gap="md" wrap>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </Flex>
        </Card>

        {/* Complex Layout Example */}
        <Card>
          <Text as="h2" fontSize="2xl" fontWeight="semibold" mb="lg">
            Complex Layout Example
          </Text>

          <Flex direction="column" gap="lg">
            {/* Header */}
            <Flex
              justify="space-between"
              align="center"
              p="md"
              className="bg-gray-50 rounded-lg"
            >
              <Text fontSize="lg" fontWeight="semibold">
                Dashboard Header
              </Text>
              <Flex gap="sm">
                <Button size="sm" variant="secondary">
                  Settings
                </Button>
                <Button size="sm">Action</Button>
              </Flex>
            </Flex>

            {/* Content Grid */}
            <Flex gap="lg" wrap>
              <Box
                p="md"
                className="flex-1 min-w-[200px] border border-gray-200 rounded-lg"
              >
                <Text fontSize="sm" color="muted" mb="sm">
                  Metric 1
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  $1,234
                </Text>
                <Text fontSize="xs" color="success">
                  +12% from last month
                </Text>
              </Box>

              <Box
                p="md"
                className="flex-1 min-w-[200px] border border-gray-200 rounded-lg"
              >
                <Text fontSize="sm" color="muted" mb="sm">
                  Metric 2
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  567
                </Text>
                <Text fontSize="xs" color="danger">
                  -5% from last month
                </Text>
              </Box>

              <Box
                p="md"
                className="flex-1 min-w-[200px] border border-gray-200 rounded-lg"
              >
                <Text fontSize="sm" color="muted" mb="sm">
                  Metric 3
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  89%
                </Text>
                <Text fontSize="xs" color="muted">
                  No change
                </Text>
              </Box>
            </Flex>

            {/* Footer */}
            <Flex justify="center" p="md" className="bg-gray-50 rounded-lg">
              <Text fontSize="sm" color="muted">
                Last updated: {new Date().toLocaleString()}
              </Text>
            </Flex>
          </Flex>
        </Card>

        {/* Before/After Comparison */}
        <Card>
          <Text as="h2" fontSize="2xl" fontWeight="semibold" mb="lg">
            Before vs After Comparison
          </Text>

          <Flex gap="lg" direction="column">
            <Box>
              <Text fontSize="lg" fontWeight="medium" mb="md" color="danger">
                ❌ Before (Inline Styles)
              </Text>
              <Box
                p="md"
                className="bg-red-50 border border-red-200 rounded-lg"
              >
                <pre className="text-sm">
                  {`<div style={{
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  padding: "1rem",
  margin: "0.5rem 0"
}}>
  <h3 style={{ margin: 0, fontSize: "1.25rem" }}>
    Title
  </h3>
  <p style={{ 
    margin: 0, 
    color: "var(--color-muted)",
    fontSize: "0.875rem"
  }}>
    Subtitle
  </p>
</div>`}
                </pre>
              </Box>
            </Box>

            <Box>
              <Text fontSize="lg" fontWeight="medium" mb="md" color="success">
                ✅ After (Design System)
              </Text>
              <Box
                p="md"
                className="bg-green-50 border border-green-200 rounded-lg"
              >
                <pre className="text-sm">
                  {`<Flex align="center" gap="sm" p="lg" my="sm">
  <Text as="h3" fontSize="lg" mb="none">
    Title
  </Text>
  <Text color="muted" fontSize="sm" mb="none">
    Subtitle
  </Text>
</Flex>`}
                </pre>
              </Box>
            </Box>
          </Flex>
        </Card>
      </Stack>
    </Container>
  );
};

export default ComponentLibraryExample;
